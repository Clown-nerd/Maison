import type { SupabaseClient } from '@supabase/supabase-js';
import { SITE_CONFIG } from '../config/site';
import { SAMPLE_CATEGORIES, SAMPLE_PRODUCTS } from '../data/sampleCatalogue';
import {
  getConfiguredDataSource,
  getSupabaseClient,
  isSupabaseConfigured,
} from '../lib/supabaseClient';
import {
  CatalogueError,
  type BuildType,
  type Category,
  type DbCategoryRow,
  type DbProductImageRow,
  type DbProductRow,
  type DbStoreSettingsRow,
  type Product,
  type ProductFilterCriteria,
  type StoreSettings,
} from '../types/furniture';
import { filterProducts } from '../utils/catalogue';

export interface CatalogueRepository {
  readonly source: 'sample-demo' | 'supabase';
  getCategories(): Promise<Category[]>;
  getProducts(): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getProductsByCategory(categorySlug: string): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  searchProducts(
    query: string,
    criteria?: Omit<ProductFilterCriteria, 'query'>
  ): Promise<Product[]>;
  getRelatedProducts(product: Product, limit?: number): Promise<Product[]>;
  getStoreSettings(): Promise<StoreSettings>;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  businessName: SITE_CONFIG.brandName,
  tagline: SITE_CONFIG.tagline,
  whatsappNumber: SITE_CONFIG.whatsapp.phoneNumber,
  displayPhone: SITE_CONFIG.whatsapp.displayPhone,
  phoneNumber: SITE_CONFIG.contact.phone,
  email: SITE_CONFIG.contact.email,
  addressLine1: SITE_CONFIG.contact.addressLine1,
  addressLine2: SITE_CONFIG.contact.addressLine2,
  deliveryInformation: SITE_CONFIG.fulfilment.nairobiDelivery,
  regionalDeliveryInformation: SITE_CONFIG.fulfilment.regionalDelivery,
  collectionInformation: SITE_CONFIG.fulfilment.collection,
  openingHours: SITE_CONFIG.contact.hours,
  sundayHours: SITE_CONFIG.contact.sundayHours,
  logoUrl: null,
  isDemoContent: true,
};

/**
 * Sanitizes free-text search queries before embedding in PostgREST `.or()` filter syntax.
 */
export function sanitizePostgrestSearchTerm(rawQuery: string): string {
  return rawQuery
    .trim()
    .replace(/[,()*\\]/g, ' ')
    .replace(/[%_]/g, (char) => `\\${char}`)
    .replace(/\s+/g, ' ')
    .trim();
}

export function mapDbCategoryRow(row: DbCategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle ?? '',
    description: row.description ?? '',
    image: row.image_url,
    displayOrder: row.display_order ?? 0,
  };
}

function resolveBuildType(
  productType: DbProductRow['product_type'],
  supportsCustomSizing?: boolean | null
): BuildType {
  if (productType === 'custom_made') {
    return 'custom-made';
  }
  return supportsCustomSizing ? 'both' : 'ready-made';
}

export function mapDbProductRow(row: DbProductRow): Product {
  const categoryObj = Array.isArray(row.category)
    ? (row.category[0] ?? null)
    : (row.category ?? null);

  const sortedImages: DbProductImageRow[] = Array.isArray(row.product_images)
    ? [...row.product_images].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
      )
    : [];

  const dims = row.dimensions ?? {};
  const specs = row.specifications ?? {};
  const colors = Array.isArray(row.colors) ? row.colors : [];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categorySlug: categoryObj?.slug ?? 'sofas',
    categoryName: categoryObj?.name ?? 'Furniture',
    priceKes: Number(row.price) || 0,
    shortSummary: row.short_summary ?? '',
    description: row.description,
    images: sortedImages
      .filter((img) => Boolean(img.image_url))
      .map((img) => ({
        url: img.image_url,
        alt: img.alt_text || row.name,
        caption: img.caption ?? undefined,
      })),
    dimensions: {
      widthCm: Number(dims.widthCm) || 0,
      depthCm: Number(dims.depthCm) || 0,
      heightCm: Number(dims.heightCm) || 0,
      seatHeightCm:
        typeof dims.seatHeightCm === 'number' ? dims.seatHeightCm : undefined,
      notes: typeof dims.notes === 'string' ? dims.notes : undefined,
    },
    specifications: {
      frameMaterial: specs.frameMaterial || row.materials,
      upholsteryOrFinish: specs.upholsteryOrFinish || row.finishes,
      joinery: specs.joinery || 'Traditional hardwood joinery',
      leadTime: specs.leadTime || 'Confirm lead time via WhatsApp',
      origin: specs.origin || 'Nairobi, Kenya',
      care: specs.care || 'Dust with dry cloth; condition natural timber periodically',
    },
    colors,
    buildType: resolveBuildType(row.product_type, row.supports_custom_sizing),
    availability: row.availability_status,
    availabilityDetail: row.availability_detail ?? '',
    featured: Boolean(row.featured),
    isDemoContent: Boolean(row.is_demo_content),
  };
}

export function mapDbStoreSettingsRow(
  row: DbStoreSettingsRow | null
): StoreSettings {
  if (!row) {
    return { ...DEFAULT_STORE_SETTINGS };
  }

  const addressParts = row.address.split(',').map((part) => part.trim());
  const hasTwoLineSplit = addressParts.length >= 3;
  const addressLine1 = hasTwoLineSplit
    ? addressParts.slice(0, -2).join(', ')
    : row.address;
  const addressLine2 = hasTwoLineSplit
    ? addressParts.slice(-2).join(', ')
    : DEFAULT_STORE_SETTINGS.addressLine2;

  return {
    businessName: row.business_name || DEFAULT_STORE_SETTINGS.businessName,
    tagline: row.tagline || DEFAULT_STORE_SETTINGS.tagline,
    whatsappNumber: row.whatsapp_number || DEFAULT_STORE_SETTINGS.whatsappNumber,
    displayPhone: row.phone_number || DEFAULT_STORE_SETTINGS.displayPhone,
    phoneNumber: row.phone_number || DEFAULT_STORE_SETTINGS.phoneNumber,
    email: row.email || DEFAULT_STORE_SETTINGS.email,
    addressLine1,
    addressLine2,
    deliveryInformation:
      row.delivery_information || DEFAULT_STORE_SETTINGS.deliveryInformation,
    regionalDeliveryInformation:
      row.regional_delivery_information ||
      DEFAULT_STORE_SETTINGS.regionalDeliveryInformation,
    collectionInformation:
      row.collection_information || DEFAULT_STORE_SETTINGS.collectionInformation,
    openingHours: row.opening_hours || DEFAULT_STORE_SETTINGS.openingHours,
    sundayHours: DEFAULT_STORE_SETTINGS.sundayHours,
    logoUrl: row.logo_url ?? null,
    isDemoContent: Boolean(row.is_demo_content),
  };
}

/**
 * Local Demonstration Implementation.
 */
export class SampleCatalogueRepository implements CatalogueRepository {
  readonly source = 'sample-demo' as const;

  async getCategories(): Promise<Category[]> {
    return [...SAMPLE_CATEGORIES].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getProducts(): Promise<Product[]> {
    return [...SAMPLE_PRODUCTS];
  }

  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    return SAMPLE_PRODUCTS.filter((p) => p.featured).slice(0, limit);
  }

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    if (!categorySlug || categorySlug === 'all') {
      return this.getProducts();
    }
    return SAMPLE_PRODUCTS.filter((p) => p.categorySlug === categorySlug);
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return SAMPLE_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  async searchProducts(
    query: string,
    criteria?: Omit<ProductFilterCriteria, 'query'>
  ): Promise<Product[]> {
    return filterProducts(SAMPLE_PRODUCTS, {
      query,
      category: criteria?.category,
      buildType: criteria?.buildType,
    });
  }

  async getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
    const sameCategory = SAMPLE_PRODUCTS.filter(
      (p) => p.id !== product.id && p.categorySlug === product.categorySlug
    );
    const otherFeatured = SAMPLE_PRODUCTS.filter(
      (p) => p.id !== product.id && p.categorySlug !== product.categorySlug && p.featured
    );
    return [...sameCategory, ...otherFeatured].slice(0, limit);
  }

  async getStoreSettings(): Promise<StoreSettings> {
    return { ...DEFAULT_STORE_SETTINGS };
  }
}

const PRODUCT_SELECT_WITH_RELATIONS =
  '*, category:categories(*), product_images(*)';

/**
 * Supabase-Backed Catalogue Implementation (Milestone 2).
 * Reads only published products and public storefront metadata via RLS.
 * Errors are surfaced explicitly via CatalogueError rather than masked.
 */
export class SupabaseCatalogueRepository implements CatalogueRepository {
  readonly source = 'supabase' as const;
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  private wrapError(context: string, error: { message: string; code?: string }): CatalogueError {
    return new CatalogueError(`${context}: ${error.message}`, {
      code: error.code,
      cause: error,
    });
  }

  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw this.wrapError('Unable to load furniture categories', error);
    }

    return ((data ?? []) as DbCategoryRow[]).map(mapDbCategoryRow);
  }

  async getProducts(): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select(PRODUCT_SELECT_WITH_RELATIONS)
      .eq('published', true)
      .order('created_at', { ascending: true });

    if (error) {
      throw this.wrapError('Unable to load furniture catalogue', error);
    }

    return ((data ?? []) as DbProductRow[]).map(mapDbProductRow);
  }

  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select(PRODUCT_SELECT_WITH_RELATIONS)
      .eq('published', true)
      .eq('featured', true)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      throw this.wrapError('Unable to load featured furniture pieces', error);
    }

    return ((data ?? []) as DbProductRow[]).map(mapDbProductRow);
  }

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    if (!categorySlug || categorySlug === 'all') {
      return this.getProducts();
    }

    const { data: categoryRow, error: catError } = await this.client
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (catError) {
      throw this.wrapError('Unable to resolve furniture category', catError);
    }

    if (!categoryRow) {
      return [];
    }

    const { data, error } = await this.client
      .from('products')
      .select(PRODUCT_SELECT_WITH_RELATIONS)
      .eq('published', true)
      .eq('category_id', (categoryRow as { id: string }).id)
      .order('created_at', { ascending: true });

    if (error) {
      throw this.wrapError('Unable to load category products', error);
    }

    return ((data ?? []) as DbProductRow[]).map(mapDbProductRow);
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await this.client
      .from('products')
      .select(PRODUCT_SELECT_WITH_RELATIONS)
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      throw this.wrapError('Unable to load product details', error);
    }

    if (!data) {
      return null;
    }

    return mapDbProductRow(data as DbProductRow);
  }

  async searchProducts(
    query: string,
    criteria?: Omit<ProductFilterCriteria, 'query'>
  ): Promise<Product[]> {
    let categoryId: string | null = null;
    if (criteria?.category && criteria.category !== 'all') {
      const { data: categoryRow, error: catError } = await this.client
        .from('categories')
        .select('id')
        .eq('slug', criteria.category)
        .maybeSingle();

      if (catError) {
        throw this.wrapError('Unable to filter by furniture category', catError);
      }

      if (!categoryRow) {
        return [];
      }
      categoryId = (categoryRow as { id: string }).id;
    }

    let request = this.client
      .from('products')
      .select(PRODUCT_SELECT_WITH_RELATIONS)
      .eq('published', true);

    if (categoryId) {
      request = request.eq('category_id', categoryId);
    }

    const sanitized = sanitizePostgrestSearchTerm(query);
    if (sanitized.length > 0) {
      const pattern = `%${sanitized}%`;
      request = request.or(
        `name.ilike.${pattern},short_summary.ilike.${pattern},description.ilike.${pattern},materials.ilike.${pattern},finishes.ilike.${pattern}`
      );
    } else if (criteria?.buildType === 'ready-made') {
      request = request.eq('product_type', 'ready_made');
    }

    const { data, error } = await request.order('created_at', { ascending: true });

    if (error) {
      throw this.wrapError('Unable to search furniture catalogue', error);
    }

    const mapped = ((data ?? []) as DbProductRow[]).map(mapDbProductRow);

    if (!criteria?.buildType || criteria.buildType === 'all') {
      return mapped;
    }

    return filterProducts(mapped, { buildType: criteria.buildType });
  }

  async getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select(PRODUCT_SELECT_WITH_RELATIONS)
      .eq('published', true)
      .neq('id', product.id)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(Math.max(limit * 3, 6));

    if (error) {
      throw this.wrapError('Unable to load complementary products', error);
    }

    const candidates = ((data ?? []) as DbProductRow[]).map(mapDbProductRow);
    const sameCategory = candidates.filter(
      (item) => item.categorySlug === product.categorySlug
    );
    const otherPieces = candidates.filter(
      (item) => item.categorySlug !== product.categorySlug
    );

    return [...sameCategory, ...otherPieces].slice(0, limit);
  }

  async getStoreSettings(): Promise<StoreSettings> {
    const { data, error } = await this.client
      .from('store_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw this.wrapError('Unable to load showroom store settings', error);
    }

    return mapDbStoreSettingsRow((data as DbStoreSettingsRow | null) ?? null);
  }
}

/**
 * Repository used when VITE_DATA_SOURCE="supabase" is requested without credentials.
 * Fails loudly so misconfiguration is surfaced explicitly rather than masked.
 */
class UnconfiguredSupabaseRepository implements CatalogueRepository {
  readonly source = 'supabase' as const;

  private fail(): never {
    throw new CatalogueError(
      'Supabase data source is enabled, but VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing.',
      { code: 'SUPABASE_NOT_CONFIGURED' }
    );
  }

  async getCategories(): Promise<Category[]> {
    return this.fail();
  }
  async getProducts(): Promise<Product[]> {
    return this.fail();
  }
  async getFeaturedProducts(): Promise<Product[]> {
    return this.fail();
  }
  async getProductsByCategory(): Promise<Product[]> {
    return this.fail();
  }
  async getProductBySlug(): Promise<Product | null> {
    return this.fail();
  }
  async searchProducts(): Promise<Product[]> {
    return this.fail();
  }
  async getRelatedProducts(): Promise<Product[]> {
    return this.fail();
  }
  async getStoreSettings(): Promise<StoreSettings> {
    return this.fail();
  }
}

/**
 * Selects SampleCatalogueRepository or SupabaseCatalogueRepository from configuration.
 * - VITE_DATA_SOURCE="sample" -> always SampleCatalogueRepository
 * - VITE_DATA_SOURCE="supabase" -> always SupabaseCatalogueRepository (errors if unconfigured)
 * - VITE_DATA_SOURCE="auto" (default) -> SupabaseCatalogueRepository when env vars exist, else SampleCatalogueRepository
 */
export function createCatalogueRepository(
  envOverrides?: Record<string, string | undefined>
): CatalogueRepository {
  const mode = getConfiguredDataSource(envOverrides);

  if (mode === 'sample') {
    return new SampleCatalogueRepository();
  }

  const configured = isSupabaseConfigured(envOverrides);
  if (mode === 'supabase' && !configured) {
    return new UnconfiguredSupabaseRepository();
  }

  if (configured) {
    const client = getSupabaseClient(envOverrides);
    if (client) {
      return new SupabaseCatalogueRepository(client);
    }
  }

  return new SampleCatalogueRepository();
}

export const catalogueRepository = createCatalogueRepository();
