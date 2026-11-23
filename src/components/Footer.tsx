import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../config/site';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { WhatsAppInquiryButton } from './WhatsAppInquiryButton';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings, categories } = useStoreSettings();

  return (
    <footer className="bg-[#292723] text-[#F5F1E9]">
      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="font-serif text-3xl font-medium tracking-tight text-[#F5F1E9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9C8B2]"
            >
              {settings.businessName}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#D9C8B2]/90">
              {settings.tagline}. Thoughtfully crafted ready-made and custom-made pieces for Kenyan homes, studios, and hospitality spaces.
            </p>
            <div className="mt-6">
              <WhatsAppInquiryButton
                variant="light"
                label="Consult via WhatsApp"
                className="px-5 py-2.5 text-xs"
              />
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-lg font-medium text-[#F5F1E9]">
              Furniture Categories
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#D9C8B2]">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/collection?category=${category.slug}`}
                      className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9C8B2]"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    to="/collection"
                    className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9C8B2]"
                  >
                    Browse Full Collection
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Navigation & Fulfilment */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-lg font-medium text-[#F5F1E9]">
              Showroom
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#D9C8B2]">
              {SITE_CONFIG.navigation.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9C8B2]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/collection?build=custom-made"
                  className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9C8B2]"
                >
                  Custom Commissions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Visit & Hours */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-lg font-medium text-[#F5F1E9]">
              Nairobi Studio
            </h3>
            <address className="mt-4 not-italic text-sm leading-relaxed text-[#D9C8B2]">
              <p>{settings.addressLine1}</p>
              <p>{settings.addressLine2}</p>
              <p className="mt-3 text-[#F5F1E9]">{settings.phoneNumber}</p>
              <p>
                <a
                  href={`mailto:${settings.email}`}
                  className="transition-colors hover:text-white"
                >
                  {settings.email}
                </a>
              </p>
              <p className="mt-3 text-xs text-[#D9C8B2]/80">
                {settings.openingHours}
              </p>
              <p className="text-xs text-[#D9C8B2]/80">
                {settings.sundayHours}
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Legal & Demonstration Note */}
        <div className="mt-14 border-t border-[#F5F1E9]/15 pt-8 flex flex-col gap-3 text-xs text-[#D9C8B2]/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {settings.businessName}. All rights reserved. Prices listed in{' '}
            {SITE_CONFIG.currency.code}.
          </p>
          {settings.isDemoContent && (
            <p className="max-w-xl sm:text-right">{SITE_CONFIG.demoDisclaimer}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
