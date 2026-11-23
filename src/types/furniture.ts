export type CategorySlug =
  | 'sofas'
  | 'beds'
  | 'dining-furniture'
  | 'office-furniture'
  | 'wardrobes'
  | 'tv-stands'
  | 'outdoor-furniture'
  | (string & {});

export type BuildType = 'ready-made' | 'custom-made' | 'both';

export type AvailabilityStatus = 'In Stock' | 'Low Stock' | 'Made to Order';

export interface ProductColor {
  name: string;
  hex: string;
  materialNote?: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface ProductDimensions {
  widthCm: number;
  depthCm: number;
  heightCm: number;
  seatHeightCm?: number;
  notes?: string;
}

export interface ProductSpecifications {
  frameMaterial: string;
  upholsteryOrFinish: string;
  joinery: string;
  leadTime: string;
  origin: string;
  care: string;
}

/**
 * Core Product entity shared across local sample data and Supabase queries.
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: CategorySlug;
  categoryName: string;
  priceKes: number;
  shortSummary: string;
  description: string;
  images: ProductImage[];
  dimensions: ProductDimensions;
  specifications: ProductSpecifications;
  colors: ProductColor[];
  buildType: BuildType;
  availability: AvailabilityStatus;
  availabilityDetail: string;
  featured: boolean;
  isDemoContent: boolean;
}

/**
 * Core Category entity shared across local sample data and Supabase queries.
 */
export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  displayOrder: number;
}

export interface ProductFilterCriteria {
  category?: CategorySlug | 'all';
  query?: string;
  buildType?: 'all' | 'ready-made' | 'custom-made';
}

export interface StoreSettings {
  businessName: string;
  tagline: string;
  whatsappNumber: string;
  displayPhone: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  deliveryInformation: string;
  regionalDeliveryInformation: string;
  collectionInformation: string;
  openingHours: string;
  sundayHours: string;
  logoUrl: string | null;
  isDemoContent: boolean;
}

export class CatalogueError extends Error {
  readonly code?: string;
  readonly cause?: unknown;

  constructor(message: string, options?: { code?: string; cause?: unknown }) {
    super(message);
    this.name = 'CatalogueError';
    this.code = options?.code;
    this.cause = options?.cause;
  }
}

export interface DbCategoryRow {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  display_order: number | null;
  created_at?: string;
}

export interface DbProductImageRow {
  id?: string;
  product_id?: string;
  image_url: string;
  alt_text: string;
  caption?: string | null;
  display_order: number | null;
}

export interface DbProductRow {
  id: string;
  name: string;
  slug: string;
  short_summary: string | null;
  description: string;
  price: number | string;
  category_id: string;
  product_type: 'ready_made' | 'custom_made';
  supports_custom_sizing?: boolean | null;
  availability_status: AvailabilityStatus;
  availability_detail: string | null;
  dimensions: Partial<ProductDimensions> | null;
  materials: string;
  finishes: string;
  specifications: Partial<ProductSpecifications> | null;
  colors: ProductColor[] | null;
  featured: boolean;
  published: boolean;
  is_demo_content: boolean;
  created_at?: string;
  updated_at?: string;
  category?: DbCategoryRow | DbCategoryRow[] | null;
  product_images?: DbProductImageRow[] | null;
}

export interface DbStoreSettingsRow {
  id: string;
  business_name: string;
  tagline: string | null;
  whatsapp_number: string;
  phone_number: string;
  email: string;
  address: string;
  delivery_information: string;
  regional_delivery_information: string | null;
  collection_information: string;
  opening_hours: string | null;
  logo_url: string | null;
  is_demo_content: boolean;
  updated_at?: string;
}

export interface ShowroomConfig {
  brandName: string;
  tagline: string;
  market: string;
  currency: {
    code: string;
    symbol: string;
    locale: string;
  };
  whatsapp: {
    phoneNumber: string;
    displayPhone: string;
    defaultGreeting: string;
  };
  contact: {
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    hours: string;
    sundayHours: string;
  };
  fulfilment: {
    nairobiDelivery: string;
    regionalDelivery: string;
    collection: string;
  };
  demoDisclaimer: string;
  navigation: Array<{
    label: string;
    path: string;
  }>;
}
