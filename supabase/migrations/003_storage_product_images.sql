-- ============================================================================
-- Maison Living — Milestone 2: Supabase Storage Bucket & Policies
-- ============================================================================
-- Bucket: product-images
-- Accepted formats: image/jpeg, image/png, image/webp
-- File size limit: 5 MiB (5242880 bytes)
-- Filename convention: products/<product-slug>/<order>-<descriptive-name>.<ext>
--   Example: products/karen-boucle-three-seater-sofa/01-front-elevation.webp
-- ============================================================================

INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public visitors can inspect/view objects linked to published products;
-- administrators can view all objects in the bucket (including drafts).
DROP POLICY IF EXISTS "Public can view published product storage images" ON storage.objects;
CREATE POLICY "Public can view published product storage images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'product-images'
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1
        FROM public.product_images pi
        JOIN public.products p ON p.id = pi.product_id
        WHERE p.published = true
          AND pi.image_url LIKE '%' || storage.objects.name
      )
    )
  );

-- Only administrators can upload new product photographs
DROP POLICY IF EXISTS "Admins can upload product storage images" ON storage.objects;
CREATE POLICY "Admins can upload product storage images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

-- Only administrators can replace/update product photographs
DROP POLICY IF EXISTS "Admins can update product storage images" ON storage.objects;
CREATE POLICY "Admins can update product storage images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

-- Only administrators can delete product photographs
DROP POLICY IF EXISTS "Admins can delete product storage images" ON storage.objects;
CREATE POLICY "Admins can delete product storage images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND public.is_admin()
  );
