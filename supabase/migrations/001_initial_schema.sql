-- ============================================================================
-- Maison Living — Milestone 2: Initial PostgreSQL Schema
-- ============================================================================
-- Tables:
--   1. categories
--   2. products
--   3. product_images
--   4. store_settings
--   5. profiles
--
-- Currency convention: All product prices are stored as numeric KES values
-- without formatting symbols.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------------------------------------------------------
-- Shared updated_at trigger function
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- 1. Categories
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  subtitle text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_display_order
  ON public.categories (display_order ASC, name ASC);

-- ----------------------------------------------------------------------------
-- 2. Products
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_summary text NOT NULL DEFAULT '',
  description text NOT NULL,
  price numeric(12, 2) NOT NULL CHECK (price >= 0),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  product_type text NOT NULL CHECK (product_type IN ('ready_made', 'custom_made')),
  supports_custom_sizing boolean NOT NULL DEFAULT false,
  availability_status text NOT NULL CHECK (
    availability_status IN ('In Stock', 'Low Stock', 'Made to Order')
  ),
  availability_detail text NOT NULL DEFAULT '',
  dimensions jsonb NOT NULL DEFAULT '{}'::jsonb,
  materials text NOT NULL,
  finishes text NOT NULL,
  specifications jsonb NOT NULL DEFAULT '{}'::jsonb,
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  is_demo_content boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category_published
  ON public.products (category_id, published);

CREATE INDEX IF NOT EXISTS idx_products_published_featured
  ON public.products (published, featured)
  WHERE published = true;

CREATE INDEX IF NOT EXISTS idx_products_product_type
  ON public.products (product_type)
  WHERE published = true;

CREATE INDEX IF NOT EXISTS idx_products_search_tsv
  ON public.products
  USING gin (
    to_tsvector(
      'english',
      coalesce(name, '') || ' ' ||
      coalesce(short_summary, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(materials, '') || ' ' ||
      coalesce(finishes, '')
    )
  );

DROP TRIGGER IF EXISTS trg_products_set_updated_at ON public.products;
CREATE TRIGGER trg_products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. Product Images
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text NOT NULL,
  caption text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_order
  ON public.product_images (product_id, display_order ASC);

-- ----------------------------------------------------------------------------
-- 4. Store Settings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  whatsapp_number text NOT NULL,
  phone_number text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  delivery_information text NOT NULL,
  regional_delivery_information text NOT NULL DEFAULT '',
  collection_information text NOT NULL,
  opening_hours text NOT NULL DEFAULT '',
  logo_url text,
  is_demo_content boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_store_settings_set_updated_at ON public.store_settings;
CREATE TRIGGER trg_store_settings_set_updated_at
  BEFORE UPDATE ON public.store_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 5. Profiles (Linked to Supabase Auth)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_profiles_set_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Automatically provision a customer profile whenever a new user signs up.
-- Always defaults role to 'customer'; ignores any client-supplied metadata role.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    coalesce(NEW.raw_user_meta_data ->> 'full_name', ''),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
