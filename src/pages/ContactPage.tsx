import { useMemo, useState } from 'react';
import { Check, Copy, Clock, MapPin, Phone, Truck } from 'lucide-react';
import { DatabaseErrorNotice } from '../components/DatabaseErrorNotice';
import { WhatsAppInquiryButton } from '../components/WhatsAppInquiryButton';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { generateGeneralInquiryMessage } from '../utils/whatsapp';

export function ContactPage() {
  const { settings, categories, error, reload } = useStoreSettings();
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('Ready-Made Showroom Piece');
  const [fulfilmentMethod, setFulfilmentMethod] = useState<'Delivery' | 'Showroom Collection'>('Delivery');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const composedMessage = useMemo(
    () =>
      generateGeneralInquiryMessage({
        name,
        topic,
        fulfilmentMethod,
        notes,
        brandName: settings.businessName,
      }),
    [name, topic, fulfilmentMethod, notes, settings.businessName]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(composedMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="bg-[#F5F1E9] pb-24">
      {/* Page Header */}
      <section className="border-b border-[#292723]/10 bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <p className="text-xs font-medium tracking-wide text-[#8C735B]">
            Contact & Showroom
          </p>
          <h1 className="mt-2 font-serif text-4xl font-normal text-[#292723] sm:text-5xl">
            Visit our Karen courtyard or inquire on WhatsApp
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#292723]/75">
            Arrange a private material consultation, verify stock availability, or schedule delivery and collection across Kenya.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pt-14 lg:px-10">
        {error && (
          <div className="mb-8">
            <DatabaseErrorNotice
              title="Unable to sync live showroom settings"
              message={error}
              onRetry={reload}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          {/* Left: Showroom Information & Fulfilment */}
          <div className="lg:col-span-5 space-y-10">
            <div className="border border-[#292723]/12 bg-white p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-2xl font-normal text-[#292723]">
                Nairobi Showroom
              </h2>

              <div className="space-y-4 text-sm text-[#292723]/80">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8C735B]" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-[#292723]">{settings.addressLine1}</p>
                    <p>{settings.addressLine2}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#8C735B]" aria-hidden="true" />
                  <div>
                    <p>{settings.openingHours}</p>
                    <p className="text-[#292723]/65">{settings.sundayHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#8C735B]" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-[#292723]">{settings.phoneNumber}</p>
                    <p>{settings.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#292723]/12 bg-white p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-[#8C735B]" aria-hidden="true" />
                <h2 className="font-serif text-2xl font-normal text-[#292723]">
                  Delivery & Collection
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-[#292723]/75">
                {settings.deliveryInformation}
              </p>
              <p className="text-sm leading-relaxed text-[#292723]/75">
                {settings.regionalDeliveryInformation}
              </p>
              <p className="text-sm leading-relaxed text-[#292723]/75">
                {settings.collectionInformation}
              </p>
            </div>
          </div>

          {/* Right: Interactive WhatsApp Inquiry Composer */}
          <div className="lg:col-span-7">
            <div className="border border-[#292723]/12 bg-white p-6 sm:p-10">
              <p className="text-xs font-medium tracking-wide text-[#8C735B]">
                WhatsApp Concierge
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-[#292723]">
                Compose a furniture inquiry
              </h2>
              <p className="mt-2 text-sm text-[#292723]/75">
                Complete your project notes below to generate a structured WhatsApp message for our Nairobi team ({settings.displayPhone}).
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="inquiry-name"
                    className="block text-xs font-medium text-[#292723]"
                  >
                    Your Name
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Wanjiku Kamau"
                    className="mt-2 w-full border border-[#292723]/20 bg-[#F5F1E9]/40 px-4 py-3 text-sm text-[#292723] placeholder:text-[#292723]/40 focus:border-[#292723] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inquiry-topic"
                    className="block text-xs font-medium text-[#292723]"
                  >
                    Category or Request
                  </label>
                  <select
                    id="inquiry-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-2 w-full border border-[#292723]/20 bg-[#F5F1E9]/40 px-4 py-3 text-sm text-[#292723] focus:border-[#292723] focus:bg-white focus:outline-none"
                  >
                    <option value="Ready-Made Showroom Piece">Ready-Made Showroom Piece</option>
                    <option value="Custom-Made Commission">Custom-Made Commission</option>
                    <option value="Showroom Appointment (Karen)">Showroom Appointment (Karen)</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="block text-xs font-medium text-[#292723]">
                    Preferred Fulfilment
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {(['Delivery', 'Showroom Collection'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFulfilmentMethod(method)}
                        aria-pressed={fulfilmentMethod === method}
                        className={`border px-4 py-3 text-xs font-medium transition-colors ${
                          fulfilmentMethod === method
                            ? 'border-[#292723] bg-[#292723] text-[#F5F1E9]'
                            : 'border-[#292723]/20 bg-white text-[#292723]/80 hover:border-[#292723]'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="inquiry-notes"
                    className="block text-xs font-medium text-[#292723]"
                  >
                    Room Notes, Dimensions, or Delivery Location
                  </label>
                  <textarea
                    id="inquiry-notes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share desired dimensions, timber or upholstery colour, or delivery area in Kenya..."
                    className="mt-2 w-full border border-[#292723]/20 bg-[#F5F1E9]/40 px-4 py-3 text-sm text-[#292723] placeholder:text-[#292723]/40 focus:border-[#292723] focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Live Message Preview */}
                <div className="border border-[#292723]/12 bg-[#F5F1E9]/60 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#8C735B]">
                      Pre-filled WhatsApp Message Preview
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#292723] hover:text-[#8C735B]"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#8C735B]" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#292723]/80">
                    {composedMessage}
                  </pre>
                </div>

                <WhatsAppInquiryButton
                  customMessage={composedMessage}
                  label="Open Inquiry in WhatsApp"
                  fullWidth
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
