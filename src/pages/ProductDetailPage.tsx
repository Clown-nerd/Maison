import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Copy, Truck } from 'lucide-react';
import { DatabaseErrorNotice } from '../components/DatabaseErrorNotice';
import { ProductCard } from '../components/ProductCard';
import { ShowroomImage } from '../components/ShowroomImage';
import { WhatsAppInquiryButton } from '../components/WhatsAppInquiryButton';
import { SITE_CONFIG } from '../config/site';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { catalogueRepository } from '../services/catalogueRepository';
import type { Product } from '../types/furniture';
import {
  formatDimensions,
  formatKesPrice,
  getBuildTypeLabel,
} from '../utils/catalogue';
import { generateProductInquiryMessage } from '../utils/whatsapp';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useStoreSettings();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [copiedMessage, setCopiedMessage] = useState(false);

  const handleRetry = useCallback(() => {
    setRetryTick((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);
    setActiveImageIndex(0);
    setCopiedMessage(false);
    setRelatedProducts([]);

    if (!slug) {
      setProduct(null);
      setIsLoading(false);
      return;
    }

    catalogueRepository
      .getProductBySlug(slug)
      .then(async (found) => {
        if (!active) return;
        setProduct(found);
        if (found) {
          setSelectedColor(found.colors[0]?.name ?? '');
          try {
            const related = await catalogueRepository.getRelatedProducts(found, 3);
            if (active) setRelatedProducts(related);
          } catch {
            if (active) setRelatedProducts([]);
          }
        }
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load product details from the showroom database.'
        );
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug, retryTick]);

  const handleCopyInquiry = async () => {
    if (!product) return;
    const message = generateProductInquiryMessage({
      product,
      pageUrl: window.location.href,
      selectedColor,
      brandName: settings.businessName,
    });
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      // Clipboard may be unavailable in restricted contexts; fail gracefully
      setCopiedMessage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10">
        <div className="animate-pulse grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 aspect-[4/3] bg-[#D9C8B2]/45" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-4 w-40 bg-[#D9C8B2]/45" />
            <div className="h-10 w-3/4 bg-[#D9C8B2]/45" />
            <div className="h-6 w-32 bg-[#D9C8B2]/45" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[900px] px-6 py-20 lg:px-10">
        <DatabaseErrorNotice
          title="Unable to load furniture piece"
          message={error}
          onRetry={handleRetry}
        />
        <div className="mt-6">
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#292723] underline decoration-[#8C735B]/60 underline-offset-4 hover:text-[#8C735B]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Return to Collection</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[900px] px-6 py-24 text-center lg:px-10">
        <p className="text-xs font-medium tracking-wide text-[#8C735B]">
          Piece Unavailable
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[#292723]">
          We couldn’t find that furniture piece
        </h1>
        <p className="mt-3 text-base text-[#292723]/75">
          It may have been archived, unpublished, or renamed in our collection.
        </p>
        <Link
          to="/collection"
          className="mt-8 inline-flex items-center gap-2 bg-[#292723] px-6 py-3.5 text-sm font-medium text-[#F5F1E9] hover:bg-[#8C735B]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Return to Collection</span>
        </Link>
      </div>
    );
  }

  const activeImage = product.images[activeImageIndex] ?? product.images[0];
  const activeColorObj =
    product.colors.find((c) => c.name === selectedColor) ?? product.colors[0];

  return (
    <div className="bg-[#F5F1E9] pb-24">
      {/* Breadcrumb Bar */}
      <div className="border-b border-[#292723]/10 bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-2 px-6 py-4 text-xs text-[#292723]/70 lg:px-10">
          <Link to="/collection" className="hover:text-[#292723]">
            Collection
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            to={`/collection?category=${product.categorySlug}`}
            className="hover:text-[#292723]"
          >
            {product.categoryName}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#292723] font-medium">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase */}
      <section className="mx-auto max-w-[1280px] px-6 pt-8 lg:px-10 lg:pt-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Left: Multi-Photo Gallery */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden bg-[#EBE4D6]">
              <ShowroomImage
                src={activeImage?.url ?? ''}
                alt={activeImage?.alt ?? product.name}
                aspectClassName="aspect-[4/3]"
                priority
              />
            </div>

            {activeImage?.caption && (
              <p className="mt-3 text-xs text-[#292723]/65">
                {activeImage.caption}
              </p>
            )}

            {product.images.length > 1 && (
              <div
                className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4"
                role="group"
                aria-label="Product gallery views"
              >
                {product.images.map((img, index) => {
                  const isSelected = index === activeImageIndex;
                  return (
                    <button
                      key={`${img.url}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`View photograph ${index + 1}: ${img.alt}`}
                      aria-pressed={isSelected}
                      className={`overflow-hidden bg-[#EBE4D6] transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C735B] ${
                        isSelected
                          ? 'ring-2 ring-[#292723]'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <ShowroomImage
                        src={img.url}
                        alt={img.alt}
                        aspectClassName="aspect-[4/3]"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Contiguous Inquiry Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="border border-[#292723]/12 bg-white p-6">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#8C735B]">
                <span>{product.categoryName}</span>
                <span aria-hidden="true">·</span>
                <span>{getBuildTypeLabel(product.buildType)}</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#292723]">{product.availability}</span>
              </div>

              <h1 className="mt-2 font-serif text-3xl font-normal leading-tight text-[#292723]">
                {product.name}
              </h1>

              <div className="mt-3 flex items-baseline justify-between gap-4 border-b border-[#292723]/10 pb-4">
                <p className="text-xl font-medium text-[#292723] tabular-nums">
                  {formatKesPrice(product.priceKes)}
                </p>
                {product.isDemoContent && (
                  <span className="text-xs text-[#292723]/55">Sample demonstration price</span>
                )}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#292723]/80">
                {product.description}
              </p>

              {/* Available Colours / Finishes */}
              {product.colors.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-medium text-[#292723]/70">
                      Finish & Colour
                    </span>
                    <span className="text-xs font-medium text-[#292723]">
                      {activeColorObj?.name}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {product.colors.map((color) => {
                      const isSelected = color.name === selectedColor;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color.name)}
                          aria-label={`Select colour ${color.name}`}
                          aria-pressed={isSelected}
                          className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs transition-colors ${
                            isSelected
                              ? 'border-[#292723] bg-[#F5F1E9] font-medium text-[#292723]'
                              : 'border-[#292723]/15 bg-white text-[#292723]/75 hover:border-[#292723]/40'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="h-3.5 w-3.5 shrink-0 border border-[#292723]/20"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  {activeColorObj?.materialNote && (
                    <p className="mt-1.5 text-xs text-[#8C735B]">
                      {activeColorObj.materialNote}
                    </p>
                  )}
                </div>
              )}

              {/* Dimensions Summary */}
              <div className="mt-4 border-t border-[#292723]/10 pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-xs font-medium text-[#292723]/70">
                    Dimensions (W × D × H)
                  </span>
                  <span className="text-sm font-medium text-[#292723] tabular-nums">
                    {formatDimensions(product.dimensions)}
                  </span>
                </div>
                {product.dimensions.seatHeightCm && (
                  <p className="mt-0.5 text-right text-xs text-[#292723]/65 tabular-nums">
                    Seat height: {product.dimensions.seatHeightCm} cm
                  </p>
                )}
                {product.dimensions.notes && (
                  <p className="mt-1.5 text-xs leading-relaxed text-[#292723]/70">
                    {product.dimensions.notes}
                  </p>
                )}
              </div>

              {/* Availability & Fulfilment */}
              <div className="mt-4 border-t border-[#292723]/10 pt-4 text-xs leading-relaxed text-[#292723]/75 space-y-1.5">
                <p>
                  <strong className="font-medium text-[#292723]">Availability:</strong>{' '}
                  {product.availabilityDetail}
                </p>
                <p className="flex items-start gap-2">
                  <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8C735B]" aria-hidden="true" />
                  <span>
                    Nairobi white-glove delivery, regional Kenya freight, or Karen showroom collection.
                  </span>
                </p>
              </div>

              {/* Primary WhatsApp Inquiry CTA */}
              <div className="mt-5 space-y-2.5">
                <WhatsAppInquiryButton
                  product={product}
                  selectedColor={selectedColor}
                  label="Inquire on WhatsApp"
                  fullWidth
                />

                <button
                  type="button"
                  onClick={handleCopyInquiry}
                  className="inline-flex w-full items-center justify-center gap-2 border border-[#292723]/20 bg-transparent px-4 py-2 text-xs font-medium text-[#292723] transition-colors hover:border-[#292723] hover:bg-[#F5F1E9]"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#8C735B]" aria-hidden="true" />
                      <span>Pre-filled inquiry copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy inquiry message</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="mt-16 border-t border-[#292723]/12 pt-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-medium tracking-wide text-[#8C735B]">
                Technical Detail
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-[#292723]">
                Materials & specifications
              </h2>
              {product.isDemoContent && (
                <p className="mt-3 text-sm leading-relaxed text-[#292723]/75">
                  {SITE_CONFIG.demoDisclaimer}
                </p>
              )}
            </div>

            <div className="lg:col-span-8">
              <dl className="divide-y divide-[#292723]/12 border-y border-[#292723]/12 bg-white px-6 sm:px-8">
                <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 sm:gap-6">
                  <dt className="text-xs font-medium text-[#8C735B]">
                    Frame & Timber
                  </dt>
                  <dd className="text-sm text-[#292723] sm:col-span-2">
                    {product.specifications.frameMaterial}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 sm:gap-6">
                  <dt className="text-xs font-medium text-[#8C735B]">
                    Upholstery / Finish
                  </dt>
                  <dd className="text-sm text-[#292723] sm:col-span-2">
                    {product.specifications.upholsteryOrFinish}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 sm:gap-6">
                  <dt className="text-xs font-medium text-[#8C735B]">
                    Joinery & Construction
                  </dt>
                  <dd className="text-sm text-[#292723] sm:col-span-2">
                    {product.specifications.joinery}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 sm:gap-6">
                  <dt className="text-xs font-medium text-[#8C735B]">
                    Lead Time
                  </dt>
                  <dd className="text-sm text-[#292723] sm:col-span-2">
                    {product.specifications.leadTime}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 sm:gap-6">
                  <dt className="text-xs font-medium text-[#8C735B]">
                    Workshop Origin
                  </dt>
                  <dd className="text-sm text-[#292723] sm:col-span-2">
                    {product.specifications.origin}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 sm:gap-6">
                  <dt className="text-xs font-medium text-[#8C735B]">
                    Care Notes
                  </dt>
                  <dd className="text-sm text-[#292723] sm:col-span-2">
                    {product.specifications.care}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Related Pieces */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-[#292723]/12 pt-14">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-3xl font-normal text-[#292723]">
                Complementary pieces
              </h2>
              <Link
                to="/collection"
                className="text-xs font-medium text-[#292723] underline decoration-[#8C735B]/60 underline-offset-4 hover:text-[#8C735B]"
              >
                View full collection
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
