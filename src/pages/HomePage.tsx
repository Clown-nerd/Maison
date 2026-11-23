import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DatabaseErrorNotice } from '../components/DatabaseErrorNotice';
import { ProductCard } from '../components/ProductCard';
import { ShowroomImage } from '../components/ShowroomImage';
import { WhatsAppInquiryButton } from '../components/WhatsAppInquiryButton';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { SHOWROOM_MEDIA } from '../data/sampleCatalogue';
import { catalogueRepository } from '../services/catalogueRepository';
import type { Product } from '../types/furniture';

export function HomePage() {
  const {
    settings,
    categories,
    isLoading: isLoadingCategories,
    error: settingsError,
    reload: reloadSettings,
  } = useStoreSettings();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);

  const retryFeatured = useCallback(() => {
    setRetryTick((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoadingFeatured(true);
    setFeaturedError(null);

    catalogueRepository
      .getFeaturedProducts(6)
      .then((featured) => {
        if (!active) return;
        setFeaturedProducts(featured);
        setIsLoadingFeatured(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setFeaturedError(
          err instanceof Error
            ? err.message
            : 'Unable to load featured furniture pieces.'
        );
        setIsLoadingFeatured(false);
      });

    return () => {
      active = false;
    };
  }, [retryTick]);

  return (
    <div>
      {/* 1. Editorial Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#292723]">
        <div className="relative h-[560px] w-full sm:h-[640px] lg:h-[78vh] lg:min-h-[600px] lg:max-h-[820px]">
          <img
            src={SHOWROOM_MEDIA.heroLiving}
            alt="Sunlit Nairobi living room featuring a solid walnut and ivory bouclé sofa"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#292723]/92 via-[#292723]/60 to-[#292723]/25"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#292723]/75 via-[#292723]/35 to-transparent"
          />

          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-[1280px] px-6 pb-12 sm:pb-16 lg:px-10 lg:pb-20">
              <p className="text-xs font-medium tracking-wide text-[#F5F1E9]/95">
                Nairobi Showroom · Kenya
              </p>
              <h1 className="mt-3 max-w-3xl font-serif text-4xl font-normal leading-[1.08] tracking-tight text-[#F5F1E9] sm:text-5xl lg:text-[4rem]">
                Architectural furniture for calm Kenyan living.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#F5F1E9]/95 sm:text-lg">
                Solid East African timber and tailored natural upholstery, crafted for immediate placement or commissioned to your room.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  to="/collection"
                  className="inline-flex items-center gap-2.5 bg-[#F5F1E9] px-7 py-3.5 text-sm font-medium tracking-wide text-[#292723] transition-colors hover:bg-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F1E9]"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="h-4 w-4 stroke-[1.75]" aria-hidden="true" />
                </Link>
                <a
                  href="#custom-furniture"
                  className="inline-flex items-center gap-2 border border-[#F5F1E9]/65 bg-[#292723]/35 px-6 py-3.5 text-sm font-medium tracking-wide text-[#F5F1E9] backdrop-blur-[2px] transition-colors hover:border-[#F5F1E9] hover:bg-[#292723]/60 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F1E9]"
                >
                  <span>Discover Custom Furniture</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Introduction */}
      <section className="border-b border-[#292723]/10 bg-[#F5F1E9] py-20 lg:py-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium tracking-wide text-[#8C735B]">
                The House
              </p>
              <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-[#292723] sm:text-4xl">
                Designed around light, proportion, and enduring timber.
              </h2>
            </div>

            <div className="lg:col-span-7">
              <p className="text-base leading-relaxed text-[#292723]/85 sm:text-lg">
                {settings.businessName} is a contemporary Kenyan furniture showroom rooted in Karen, Nairobi. We bring together architectural silhouettes, seasoned East African hardwoods, and natural linen and bouclé textiles for homes that age with quiet grace.
              </p>
              <p className="mt-5 text-base leading-relaxed text-[#292723]/75">
                Whether you select a ready-made piece directly from our showroom floor or commission custom dimensions tailored to your residence, every inquiry is handled personally by our design team over WhatsApp or in studio.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-6 border-t border-[#292723]/12 pt-8 sm:grid-cols-3">
                <div>
                  <p className="font-serif text-xl text-[#292723]">Ready-Made</p>
                  <p className="mt-1 text-sm text-[#292723]/70">
                    Curated floor pieces prepared for 2–4 day Nairobi dispatch.
                  </p>
                </div>
                <div>
                  <p className="font-serif text-xl text-[#292723]">Custom-Made</p>
                  <p className="mt-1 text-sm text-[#292723]/70">
                    Bespoke sizing, timber species, and fabric swatches in 3–5 weeks.
                  </p>
                </div>
                <div>
                  <p className="font-serif text-xl text-[#292723]">Delivery & Collection</p>
                  <p className="mt-1 text-sm text-[#292723]/70">
                    White-glove Kenyan delivery or scheduled Karen collection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Furniture Categories */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#8C735B]">
                Categories
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-[#292723] sm:text-4xl">
                Pieces for every room
              </h2>
            </div>
            <Link
              to="/collection"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#292723] underline decoration-[#8C735B]/60 underline-offset-4 transition-colors hover:text-[#8C735B] whitespace-nowrap shrink-0"
            >
              <span>Browse full catalogue</span>
              <ArrowRight className="h-4 w-4 stroke-[1.75]" aria-hidden="true" />
            </Link>
          </div>

          {settingsError ? (
            <div className="mt-10">
              <DatabaseErrorNotice
                title="Unable to load furniture categories"
                message={settingsError}
                onRetry={reloadSettings}
              />
            </div>
          ) : isLoadingCategories ? (
            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[#EBE4D6]" />
                  <div className="mt-3.5 h-6 w-40 bg-[#EBE4D6]" />
                  <div className="mt-1.5 h-4 w-52 bg-[#EBE4D6]" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="mt-10 border border-[#292723]/12 bg-[#F5F1E9]/60 px-6 py-12 text-center">
              <p className="font-serif text-xl text-[#292723]">
                No furniture categories published yet
              </p>
              <p className="mt-1 text-sm text-[#292723]/70">
                Categories will appear here as soon as they are added to the showroom database.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/collection?category=${category.slug}`}
                  className="group block transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C735B]"
                >
                  <div className="overflow-hidden bg-[#EBE4D6]">
                    <ShowroomImage
                      src={category.image}
                      alt={`${category.name} — ${category.subtitle}`}
                      aspectClassName="aspect-[4/3]"
                      className="group-hover:[&_img]:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif text-xl font-medium text-[#292723] transition-colors group-hover:text-[#8C735B]">
                        {category.name}
                      </h3>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-[#8C735B] opacity-60 transition-transform duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-1 text-sm text-[#292723]/70">{category.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Featured Furniture Collection */}
      <section className="border-t border-[#292723]/10 bg-[#F5F1E9] py-20 lg:py-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#8C735B]">
                Featured Collection
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-[#292723] sm:text-4xl">
                Signature showroom pieces
              </h2>
            </div>
            {settings.isDemoContent && (
              <p className="text-xs text-[#292723]/65">
                Sample Kenyan Shilling (KES) pricing shown for prototype demonstration.
              </p>
            )}
          </div>

          {featuredError ? (
            <div className="mt-10">
              <DatabaseErrorNotice
                title="Unable to load featured pieces"
                message={featuredError}
                onRetry={retryFeatured}
              />
            </div>
          ) : isLoadingFeatured ? (
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[#D9C8B2]/45" />
                  <div className="mt-4 h-3 w-32 bg-[#D9C8B2]/45" />
                  <div className="mt-2 h-6 w-3/4 bg-[#D9C8B2]/45" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="mt-10 border border-[#292723]/12 bg-white px-6 py-12 text-center">
              <p className="font-serif text-xl text-[#292723]">
                No featured pieces currently published
              </p>
              <p className="mt-1 text-sm text-[#292723]/70">
                Browse the full showroom catalogue or reach out via WhatsApp for current floor availability.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-14 flex justify-center">
            <Link
              to="/collection"
              className="inline-flex items-center gap-2.5 border border-[#292723]/30 bg-transparent px-8 py-3.5 text-sm font-medium tracking-wide text-[#292723] transition-colors hover:border-[#292723] hover:bg-[#292723] hover:text-[#F5F1E9] whitespace-nowrap shrink-0"
            >
              <span>View All Collection</span>
              <ArrowRight className="h-4 w-4 stroke-[1.75]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Custom Furniture (Made-to-Order) */}
      <section id="custom-furniture" className="scroll-mt-20 bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-6">
              <ShowroomImage
                src={SHOWROOM_MEDIA.materialSwatches}
                alt="Curated timber blocks, Belgian bouclé, oat linen, cognac leather, and solid brass hardware"
                aspectClassName="aspect-[4/3] lg:aspect-auto lg:h-full"
              />
            </div>

            <div className="flex flex-col justify-center lg:col-span-6 lg:pl-6">
              <p className="text-xs font-medium tracking-wide text-[#8C735B]">
                Bespoke Commissions
              </p>
              <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-[#292723] sm:text-4xl">
                Custom-made furniture, scaled to your architecture.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#292723]/80">
                Every residence has its own light and proportions. Consult directly with our Karen design team to discuss preferred dimensions, materials, finishes, and designs—tailored from existing collection silhouettes or architectural drawings.
              </p>

              <dl className="mt-8 divide-y divide-[#292723]/10 border-y border-[#292723]/10">
                <div className="py-4 flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-sm font-medium text-[#292723]">Dimensions & Layouts</dt>
                  <dd className="text-sm text-[#292723]/75 sm:text-right">
                    Bespoke lengths, seating depths, and modular configurations
                  </dd>
                </div>
                <div className="py-4 flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-sm font-medium text-[#292723]">Materials & Finishes</dt>
                  <dd className="text-sm text-[#292723]/75 sm:text-right">
                    Walnut, Mvule, Teak, Belgian Bouclé, Linen, Full-Grain Leather
                  </dd>
                </div>
                <div className="py-4 flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-sm font-medium text-[#292723]">Custom Designs & Lead Time</dt>
                  <dd className="text-sm text-[#292723]/75 sm:text-right tabular-nums">
                    Crafted in Nairobi in 3 to 5 weeks from design approval
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <WhatsAppInquiryButton
                  label="Inquire About Custom Furniture"
                  customMessage={`Hello ${settings.businessName}, I would like to discuss a custom-made furniture piece (preferred dimensions, materials, finishes, and design).`}
                />
                <Link
                  to="/collection?build=custom-made"
                  className="px-4 py-3 text-sm font-medium text-[#292723] underline decoration-[#8C735B]/60 underline-offset-4 transition-colors hover:text-[#8C735B] whitespace-nowrap shrink-0"
                >
                  View custom-eligible pieces
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Quality & Craftsmanship */}
      <section className="bg-[#292723] py-20 text-[#F5F1E9] lg:py-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-stretch">
            <div className="flex flex-col justify-center lg:col-span-6 lg:pr-8">
              <p className="text-xs font-medium tracking-wide text-[#D9C8B2]">
                Craftsmanship
              </p>
              <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-[#F5F1E9] sm:text-4xl">
                Seasoned timber, honest joinery, and hand-rubbed finishes.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#D9C8B2]/90">
                Furniture built for Kenya must perform effortlessly across highland dryness in Nairobi and humid coastal air in Mombasa. Every board is kiln-dried to calibrated moisture levels before milling.
              </p>

              <div className="mt-10 space-y-6 border-t border-[#F5F1E9]/15 pt-8">
                <div>
                  <h3 className="font-serif text-xl text-[#F5F1E9]">
                    01. Traditional Mortise & Tenon Joinery
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#D9C8B2]/80">
                    Structural frames rely on interlocking timber joints and wedged tenons rather than brittle shortcuts, ensuring generations of stability.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#F5F1E9]">
                    02. Natural Oil & Wax Finishes
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#D9C8B2]/80">
                    Zero-VOC matte hardwax and tung oils preserve the tactile grain of hardwood while resisting everyday spills and sunlight.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#F5F1E9]">
                    03. Local Artisan Collaboration
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#D9C8B2]/80">
                    Milled, hand-planed, and upholstered in Nairobi alongside Kenyan rattan weavers and brass hardware makers.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <ShowroomImage
                src={SHOWROOM_MEDIA.workshopCraft}
                alt="Furniture artisan hand-planing solid walnut joinery in Nairobi workshop"
                aspectClassName="aspect-[4/3] lg:aspect-auto lg:h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Delivery & Collection Information */}
      <section className="bg-[#F5F1E9] py-20 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-[#8C735B]">
              Fulfilment in Kenya
            </p>
            <h2 className="mt-2 font-serif text-3xl font-normal text-[#292723] sm:text-4xl">
              Delivery & showroom collection
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 border-t border-[#292723]/12 pt-10 md:grid-cols-3">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#8C735B]">
                01 · Nairobi & Environs
              </p>
              <h3 className="mt-2 font-serif text-2xl font-normal text-[#292723]">
                White-Glove Delivery
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#292723]/75">
                {settings.deliveryInformation}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium tracking-wide text-[#8C735B]">
                02 · Nationwide Kenya
              </p>
              <h3 className="mt-2 font-serif text-2xl font-normal text-[#292723]">
                Regional Freight
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#292723]/75">
                {settings.regionalDeliveryInformation}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium tracking-wide text-[#8C735B]">
                03 · Karen Courtyard
              </p>
              <h3 className="mt-2 font-serif text-2xl font-normal text-[#292723]">
                Showroom Collection
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#292723]/75">
                {settings.collectionInformation}
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-[#292723]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm text-[#292723]/75">
              Confirm delivery fees for your Kenyan county or arrange a Karen workshop pickup window directly with our team.
            </p>
            <WhatsAppInquiryButton
              variant="outline"
              label="Inquire About Delivery or Collection"
              customMessage={`Hello ${settings.businessName}, I would like to inquire about delivery timelines or showroom collection options in Kenya.`}
            />
          </div>
        </div>
      </section>

      {/* 8. Customer Inquiry Call-to-Action */}
      <section className="border-t border-[#292723]/10 bg-[#D9C8B2]/35 py-20 lg:py-24">
        <div className="mx-auto max-w-[900px] px-6 text-center lg:px-10">
          <p className="text-xs font-medium tracking-wide text-[#8C735B]">
            Direct Consultation
          </p>
          <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-[#292723] sm:text-5xl">
            Speak directly with our Nairobi showroom team.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#292723]/80">
            Share a room photograph, confirm stock availability, or request custom dimensions and fabric samples via WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <WhatsAppInquiryButton label="Start a WhatsApp Inquiry" />
            <Link
              to="/contact"
              className="inline-flex items-center justify-center border border-[#292723]/30 px-6 py-3.5 text-sm font-medium tracking-wide text-[#292723] transition-colors hover:border-[#292723] hover:bg-[#292723]/5 whitespace-nowrap shrink-0"
            >
              View Showroom Details
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
