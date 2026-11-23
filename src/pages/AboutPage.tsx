import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ShowroomImage } from '../components/ShowroomImage';
import { WhatsAppInquiryButton } from '../components/WhatsAppInquiryButton';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { SHOWROOM_MEDIA } from '../data/sampleCatalogue';

export function AboutPage() {
  const { settings } = useStoreSettings();

  return (
    <div className="bg-[#F5F1E9]">
      {/* Editorial Intro */}
      <section className="border-b border-[#292723]/10 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <p className="text-xs font-medium tracking-wide text-[#8C735B]">
                About {settings.businessName}
              </p>
              <h1 className="mt-3 font-serif text-4xl font-normal leading-tight text-[#292723] sm:text-5xl">
                Quiet architecture crafted in Nairobi for East African homes.
              </h1>
              <p className="mt-6 text-base leading-relaxed text-[#292723]/80 sm:text-lg">
                Founded as a sanctuary for tactile timber and unhurried proportion, {settings.businessName} bridges contemporary interior architecture with Kenya’s enduring woodworking and weaving heritage.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#292723]/75">
                From our courtyard showroom in Karen, clients explore ready-made showcase pieces alongside a curated library of seasoned hardwoods, natural Belgian linens, bouclé weaves, and brushed brass hardware.
              </p>
            </div>

            <div className="lg:col-span-6">
              <ShowroomImage
                src={SHOWROOM_MEDIA.heroLiving}
                alt="Maison Living Nairobi showroom setting with sunlit walnut and ivory seating"
                aspectClassName="aspect-[4/3]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Workshop & Material Philosophy */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-6">
              <ShowroomImage
                src={SHOWROOM_MEDIA.workshopCraft}
                alt="Joiner hand-finishing solid East African walnut in our Nairobi workshop"
                aspectClassName="aspect-[4/3] lg:aspect-auto lg:h-full"
              />
            </div>

            <div className="flex flex-col justify-center lg:col-span-6 lg:pl-8">
              <p className="text-xs font-medium tracking-wide text-[#8C735B]">
                Our Workshop Process
              </p>
              <h2 className="mt-3 font-serif text-3xl font-normal text-[#292723] sm:text-4xl">
                From kiln-dried plank to in-room placement.
              </h2>

              <div className="mt-8 space-y-6 border-t border-[#292723]/12 pt-8">
                <div>
                  <h3 className="font-serif text-xl text-[#292723]">
                    01. Responsible Timber Selection
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#292723]/75">
                    We select sustainably sourced East African walnut, mvule, and teak, kiln-dried to prevent seasonal movement across Nairobi and coastal climates.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#292723]">
                    02. Ready-Made & Custom Commissions
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#292723]/75">
                    Our core collection is stocked in Karen for immediate dispatch, while bespoke dining tables, wardrobes, and modular sofas are built to exact architectural dimensions in 3 to 5 weeks.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#292723]">
                    03. Personal WhatsApp Consultation
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#292723]/75">
                    Instead of automated checkout flows, every piece begins with a direct conversation—confirming room access, fabric samples, and delivery or showroom collection scheduling.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/collection"
                  className="inline-flex items-center gap-2 bg-[#292723] px-6 py-3.5 text-sm font-medium text-[#F5F1E9] transition-colors hover:bg-[#8C735B] whitespace-nowrap shrink-0"
                >
                  <span>Explore the Collection</span>
                  <ArrowRight className="h-4 w-4 stroke-[1.75]" aria-hidden="true" />
                </Link>
                <WhatsAppInquiryButton variant="outline" label="Speak with a Designer" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
