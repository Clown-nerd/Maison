import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SAMPLE_CATEGORIES, SAMPLE_PRODUCTS } from '../data/sampleCatalogue';
import {
  CatalogueError,
  type DbCategoryRow,
  type DbProductRow,
  type DbStoreSettingsRow,
} from '../types/furniture';
import {
  createCatalogueRepository,
  DEFAULT_STORE_SETTINGS,
  SampleCatalogueRepository,
  sanitizePostgrestSearchTerm,
  SupabaseCatalogueRepository,
} from './catalogueRepository';

interface RecordedQuery {
  table: string;
  selectClause?: string;
  filters: Array<{ op: string; col?: string; val?: unknown }>;
  orders: Array<{ col: string; ascending: boolean }>;
  limitValue?: number;
  singleMode?: 'maybeSingle';
}

type MockResponder = (query: RecordedQuery) => {
  data: unknown;
  error: { message: string; code?: string } | null;
};

function createMockSupabaseClient(responder: MockResponder): {
  client: SupabaseClient;
  queries: RecordedQuery[];
} {
  const queries: RecordedQuery[] = [];

  const client = {
    from(table: string) {
      const record: RecordedQuery = {
        table,
        filters: [],
        orders: [],
      };
      queries.push(record);

      const builder = {
        select(clause: string) {
          record.selectClause = clause;
          return builder;
        },
        eq(col: string, val: unknown) {
          record.filters.push({ op: 'eq', col, val });
          return builder;
        },
        neq(col: string, val: unknown) {
          record.filters.push({ op: 'neq', col, val });
          return builder;
        },
        or(expr: string) {
          record.filters.push({ op: 'or', val: expr });
          return builder;
        },
        order(col: string, opts?: { ascending?: boolean }) {
          record.orders.push({ col, ascending: opts?.ascending ?? true });
          return builder;
        },
        limit(count: number) {
          record.limitValue = count;
          return builder;
        },
        maybeSingle() {
          record.singleMode = 'maybeSingle';
          return Promise.resolve(responder(record));
        },
        then<TResult1 = unknown, TResult2 = never>(
          onfulfilled?:
            | ((value: { data: unknown; error: { message: string; code?: string } | null }) => TResult1 | PromiseLike<TResult1>)
            | null,
          onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
        ) {
          return Promise.resolve(responder(record)).then(onfulfilled, onrejected);
        },
      };

      return builder;
    },
  };

  return {
    client: client as unknown as SupabaseClient,
    queries,
  };
}

const SAMPLE_DB_CATEGORY: DbCategoryRow = {
  id: '10000000-0000-0000-0000-000000000001',
  name: 'Sofas',
  slug: 'sofas',
  subtitle: 'Architectural Lounge Seating',
  description: 'Deep-seated sofas.',
  image_url: '/src/assets/images/cat_sofa_boucle_1795353587199.jpg',
  display_order: 1,
};

const SAMPLE_DB_PRODUCT: DbProductRow = {
  id: '20000000-0000-0000-0000-000000000001',
  name: 'Karen Bouclé Three-Seater Sofa',
  slug: 'karen-boucle-three-seater-sofa',
  short_summary: 'Exposed solid walnut rail frame with deep Belgian bouclé cushions.',
  description: 'Designed for airy Nairobi living rooms.',
  price: '185000.00',
  category_id: SAMPLE_DB_CATEGORY.id,
  product_type: 'ready_made',
  supports_custom_sizing: true,
  availability_status: 'In Stock',
  availability_detail: '2 ready-made pieces available in Karen.',
  dimensions: { widthCm: 228, depthCm: 96, heightCm: 78, seatHeightCm: 43 },
  materials: 'Kiln-dried East African walnut',
  finishes: 'Heavyweight Belgian bouclé',
  specifications: {
    frameMaterial: 'Kiln-dried East African walnut',
    upholsteryOrFinish: 'Heavyweight Belgian bouclé',
    joinery: 'Mortise-and-tenon',
    leadTime: '2–4 days',
    origin: 'Karen, Nairobi',
    care: 'Vacuum gently',
  },
  colors: [{ name: 'Warm Ivory Bouclé', hex: '#F3EFE6' }],
  featured: true,
  published: true,
  is_demo_content: true,
  category: SAMPLE_DB_CATEGORY,
  product_images: [
    {
      image_url: 'https://example.supabase.co/storage/v1/object/public/product-images/02.jpg',
      alt_text: 'Secondary elevation',
      caption: 'Side angle',
      display_order: 1,
    },
    {
      image_url: 'https://example.supabase.co/storage/v1/object/public/product-images/01.jpg',
      alt_text: 'Front elevation',
      caption: 'Front view',
      display_order: 0,
    },
  ],
};

test('SampleCatalogueRepository implements full repository contract cleanly', async () => {
  const repo = new SampleCatalogueRepository();
  assert.equal(repo.source, 'sample-demo');

  const categories = await repo.getCategories();
  assert.equal(categories.length, 7);

  const products = await repo.getProducts();
  assert.equal(products.length, 14);

  const featured = await repo.getFeaturedProducts(3);
  assert.equal(featured.length, 3);
  assert.ok(featured.every((p) => p.featured));

  const sofas = await repo.getProductsByCategory('sofas');
  assert.equal(sofas.length, 2);

  const single = await repo.getProductBySlug('karen-boucle-three-seater-sofa');
  assert.equal(single?.name, 'Karen Bouclé Three-Seater Sofa');

  const searched = await repo.searchProducts('walnut', { category: 'dining-furniture' });
  assert.ok(searched.length >= 1);
  assert.ok(searched.every((p) => p.categorySlug === 'dining-furniture'));

  const settings = await repo.getStoreSettings();
  assert.equal(settings.businessName, DEFAULT_STORE_SETTINGS.businessName);
});

test('createCatalogueRepository switches cleanly based on configuration', async () => {
  const defaultRepo = createCatalogueRepository({});
  assert.equal(defaultRepo.source, 'sample-demo');

  const forcedSample = createCatalogueRepository({
    VITE_DATA_SOURCE: 'sample',
    VITE_SUPABASE_URL: 'https://demo.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'anon-key',
  });
  assert.equal(forcedSample.source, 'sample-demo');

  const configuredSupabase = createCatalogueRepository({
    VITE_DATA_SOURCE: 'auto',
    VITE_SUPABASE_URL: 'https://demo.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'anon-key',
  });
  assert.equal(configuredSupabase.source, 'supabase');

  const misconfiguredSupabase = createCatalogueRepository({
    VITE_DATA_SOURCE: 'supabase',
  });
  assert.equal(misconfiguredSupabase.source, 'supabase');
  await assert.rejects(() => misconfiguredSupabase.getProducts(), CatalogueError);
});

test('SupabaseCatalogueRepository queries published data, sorts images, and handles missing images', async () => {
  const { client, queries } = createMockSupabaseClient((q) => {
    if (q.table === 'categories') {
      return { data: [SAMPLE_DB_CATEGORY], error: null };
    }
    if (q.table === 'products') {
      const slugFilter = q.filters.find((f) => f.op === 'eq' && f.col === 'slug');
      if (slugFilter?.val === 'no-images-product') {
        return {
          data: {
            ...SAMPLE_DB_PRODUCT,
            slug: 'no-images-product',
            product_images: null,
          },
          error: null,
        };
      }
      if (slugFilter?.val === 'missing-slug') {
        return { data: null, error: null };
      }
      return {
        data: q.singleMode === 'maybeSingle' ? SAMPLE_DB_PRODUCT : [SAMPLE_DB_PRODUCT],
        error: null,
      };
    }
    if (q.table === 'store_settings') {
      const settingsRow: DbStoreSettingsRow = {
        id: '30000000-0000-0000-0000-000000000001',
        business_name: 'Maison Living',
        tagline: 'Kenyan Architectural Furniture',
        whatsapp_number: '254711223344',
        phone_number: '+254 711 223 344',
        email: 'showroom@maisonliving.co.ke',
        address: 'Hardy Courtyard, Ushirika Road, Karen, Nairobi, Kenya',
        delivery_information: 'Nairobi white-glove delivery.',
        regional_delivery_information: 'Nationwide Kenyan freight.',
        collection_information: 'Karen collection.',
        opening_hours: 'Mon - Sat 9am - 6pm',
        logo_url: null,
        is_demo_content: false,
      };
      return { data: settingsRow, error: null };
    }
    return { data: [], error: null };
  });

  const repo = new SupabaseCatalogueRepository(client);

  const cats = await repo.getCategories();
  assert.equal(cats.length, 1);
  assert.equal(cats[0].slug, 'sofas');

  const products = await repo.getProducts();
  assert.equal(products.length, 1);
  assert.equal(products[0].priceKes, 185000);
  assert.equal(products[0].buildType, 'both');
  // Images must be sorted by display_order ascending
  assert.equal(products[0].images[0].alt, 'Front elevation');
  assert.equal(products[0].images[1].alt, 'Secondary elevation');

  const productsQuery = queries.find((q) => q.table === 'products');
  assert.ok(
    productsQuery?.filters.some((f) => f.op === 'eq' && f.col === 'published' && f.val === true),
    'Public product query must enforce published = true'
  );

  const featured = await repo.getFeaturedProducts(4);
  assert.equal(featured.length, 1);
  const featuredQuery = queries.at(-1);
  assert.equal(featuredQuery?.limitValue, 4);
  assert.ok(
    featuredQuery?.filters.some((f) => f.op === 'eq' && f.col === 'featured' && f.val === true)
  );

  const byCategory = await repo.getProductsByCategory('sofas');
  assert.equal(byCategory.length, 1);

  const noImagesProduct = await repo.getProductBySlug('no-images-product');
  assert.ok(noImagesProduct);
  assert.deepEqual(noImagesProduct.images, []);

  const missingProduct = await repo.getProductBySlug('missing-slug');
  assert.equal(missingProduct, null);

  const searchResults = await repo.searchProducts('walnut, (100%)', {
    category: 'sofas',
    buildType: 'custom-made',
  });
  assert.equal(searchResults.length, 1);
  const searchQuery = queries.at(-1);
  const orFilter = searchQuery?.filters.find((f) => f.op === 'or');
  assert.ok(orFilter && typeof orFilter.val === 'string');
  assert.ok(!String(orFilter.val).includes('(100%)'));

  const settings = await repo.getStoreSettings();
  assert.equal(settings.whatsappNumber, '254711223344');
  assert.equal(settings.isDemoContent, false);
});

test('sanitizePostgrestSearchTerm strips unsafe PostgREST filter syntax characters', () => {
  assert.equal(sanitizePostgrestSearchTerm('walnut, (sofa)*'), 'walnut sofa');
  assert.equal(sanitizePostgrestSearchTerm('50% linen_weave'), '50\\% linen\\_weave');
});

test('SupabaseCatalogueRepository surfaces database errors explicitly via CatalogueError', async () => {
  const { client } = createMockSupabaseClient(() => ({
    data: null,
    error: { message: 'relation "public.products" does not exist', code: '42P01' },
  }));

  const repo = new SupabaseCatalogueRepository(client);

  await assert.rejects(() => repo.getCategories(), CatalogueError);
  await assert.rejects(() => repo.getProducts(), CatalogueError);
  await assert.rejects(() => repo.getFeaturedProducts(), CatalogueError);
  await assert.rejects(() => repo.getProductBySlug('karen-boucle-three-seater-sofa'), CatalogueError);
  await assert.rejects(() => repo.searchProducts('sofa'), CatalogueError);
  await assert.rejects(() => repo.getStoreSettings(), CatalogueError);
});

test('SQL migrations and seed file cover required tables, RLS guards, storage limits, and all 14 demo items', () => {
  const root = process.cwd();
  const schemaSql = fs.readFileSync(path.join(root, 'supabase/migrations/001_initial_schema.sql'), 'utf8');
  const rlsSql = fs.readFileSync(path.join(root, 'supabase/migrations/002_rls_and_auth_security.sql'), 'utf8');
  const storageSql = fs.readFileSync(path.join(root, 'supabase/migrations/003_storage_product_images.sql'), 'utf8');
  const seedSql = fs.readFileSync(path.join(root, 'supabase/seed/001_demo_catalogue.sql'), 'utf8');

  for (const table of ['categories', 'products', 'product_images', 'store_settings', 'profiles']) {
    assert.ok(schemaSql.includes(`CREATE TABLE IF NOT EXISTS public.${table}`), `Missing table ${table}`);
    assert.ok(
      rlsSql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`),
      `RLS not enabled on ${table}`
    );
  }

  assert.ok(rlsSql.includes('CREATE OR REPLACE FUNCTION public.is_admin()'));
  assert.ok(rlsSql.includes('CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()'));
  assert.ok(rlsSql.includes('USING (published = true OR public.is_admin())'));

  assert.ok(storageSql.includes("'product-images'"));
  assert.ok(storageSql.includes('5242880'));
  assert.ok(storageSql.includes("'image/jpeg'"));
  assert.ok(storageSql.includes("'image/png'"));
  assert.ok(storageSql.includes("'image/webp'"));
  assert.ok(storageSql.includes('public.is_admin()'));

  for (const category of SAMPLE_CATEGORIES) {
    assert.ok(seedSql.includes(`'${category.slug}'`), `Missing category slug in seed: ${category.slug}`);
  }
  for (const product of SAMPLE_PRODUCTS) {
    assert.ok(seedSql.includes(`'${product.slug}'`), `Missing product slug in seed: ${product.slug}`);
  }
});

// Live Supabase verification (runs automatically when credentials are provided in env)
const liveUrl = process.env.VITE_SUPABASE_URL;
const liveAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (liveUrl && liveAnonKey) {
  const { createSupabaseClient } = await import('../lib/supabaseClient');

  test('Live Supabase integration: read queries succeed and anonymous write/storage attempts are rejected by RLS', async () => {
    const client = createSupabaseClient(liveUrl, liveAnonKey);
    const repo = new SupabaseCatalogueRepository(client);

    const categories = await repo.getCategories();
    assert.ok(categories.length > 0, 'Expected live categories');

    const products = await repo.getProducts();
    assert.ok(products.length > 0, 'Expected live published products');

    const firstCategory = categories[0];
    const byCategory = await repo.getProductsByCategory(firstCategory.slug);
    assert.ok(byCategory.every((p) => p.categorySlug === firstCategory.slug));

    const featured = await repo.getFeaturedProducts(6);
    assert.ok(featured.every((p) => p.featured));

    const firstSlug = products[0].slug;
    const detail = await repo.getProductBySlug(firstSlug);
    assert.equal(detail?.slug, firstSlug);

    const searchMatches = await repo.searchProducts(products[0].name.split(' ')[0]);
    assert.ok(searchMatches.length >= 1);

    const settings = await repo.getStoreSettings();
    assert.ok(settings.businessName.length > 0);

    // Verify unauthorized anonymous modifications are blocked by RLS
    const insertProductRes = await client.from('products').insert({
      name: 'Unauthorized Test Piece',
      slug: `unauthorized-${Date.now()}`,
      description: 'Should fail RLS',
      price: 1000,
      category_id: firstCategory.id,
      product_type: 'ready_made',
      availability_status: 'In Stock',
      materials: 'Timber',
      finishes: 'Oil',
      published: true,
    });
    assert.ok(insertProductRes.error, 'Anonymous product INSERT must be rejected by RLS');

    const updateSettingsRes = await client
      .from('store_settings')
      .update({ business_name: 'Hijacked Name' })
      .neq('business_name', '');
    assert.ok(
      updateSettingsRes.error || (updateSettingsRes.data ?? []).length === 0,
      'Anonymous store_settings UPDATE must be blocked by RLS'
    );

    const deleteCategoryRes = await client
      .from('categories')
      .delete()
      .eq('slug', firstCategory.slug);
    assert.ok(
      deleteCategoryRes.error || (deleteCategoryRes.data ?? []).length === 0,
      'Anonymous category DELETE must be blocked by RLS'
    );

    const uploadStorageRes = await client.storage
      .from('product-images')
      .upload(`unauthorized-test-${Date.now()}.png`, new Uint8Array([1, 2, 3]), {
        contentType: 'image/png',
      });
    assert.ok(
      uploadStorageRes.error,
      'Anonymous storage upload to product-images must be rejected by RLS'
    );
  });
}
