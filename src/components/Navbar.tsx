import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { WhatsAppInquiryButton } from './WhatsAppInquiryButton';

/**
 * Editorial Showroom Header
 * Enforces the 3-zone Top Bar Contract: Wordmark — 4 single-line links — 1 primary WhatsApp CTA.
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useStoreSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-[#292723]/10 bg-[#F5F1E9]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-6 lg:h-20 lg:gap-8 lg:px-10">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="inline-flex items-center gap-2.5 font-serif text-2xl font-medium tracking-tight text-[#292723] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C735B]"
        >
          {settings.logoUrl && (
            <img
              src={settings.logoUrl}
              alt=""
              className="h-7 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          )}
          <span>{settings.businessName}</span>
        </Link>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden items-center gap-5 md:flex lg:gap-8">
          {SITE_CONFIG.navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `relative py-1 text-sm font-medium tracking-wide transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C735B] ${
                  isActive
                    ? 'text-[#292723] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[#292723]'
                    : 'text-[#292723]/70 hover:text-[#292723]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action & Mobile Drawer Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:block">
            <WhatsAppInquiryButton variant="nav" label="WhatsApp Inquiry" />
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            className="inline-flex h-11 w-11 items-center justify-center text-[#292723] transition-colors hover:bg-[#D9C8B2]/35 md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C735B]"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 stroke-[1.75]" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5 stroke-[1.75]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="border-t border-[#292723]/10 bg-[#F5F1E9] px-6 py-6 md:hidden"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-4">
            {SITE_CONFIG.navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `py-2 text-base font-medium transition-colors ${
                    isActive ? 'text-[#292723]' : 'text-[#292723]/70 hover:text-[#292723]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-[#292723]/10">
              <WhatsAppInquiryButton variant="primary" label="WhatsApp Inquiry" fullWidth />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
