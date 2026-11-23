import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { useStoreSettings } from '../context/StoreSettingsContext';
import type { Product } from '../types/furniture';
import {
  buildWhatsAppInquiryUrl,
  generateProductInquiryMessage,
} from '../utils/whatsapp';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'nav' | 'light';

interface WhatsAppInquiryButtonProps {
  product?: Product;
  selectedColor?: string;
  customMessage?: string;
  label?: string;
  variant?: ButtonVariant;
  className?: string;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[#292723] text-[#F5F1E9] hover:bg-[#3D3933] border border-[#292723]',
  secondary:
    'bg-[#8C735B] text-white hover:bg-[#77604B] border border-[#8C735B]',
  outline:
    'bg-transparent text-[#292723] border border-[#292723]/30 hover:border-[#292723] hover:bg-[#292723]/5',
  light:
    'bg-[#F5F1E9] text-[#292723] hover:bg-white border border-[#F5F1E9]',
  nav:
    'bg-[#292723] text-[#F5F1E9] hover:bg-[#8C735B] border border-transparent text-xs px-4 py-2',
};

/**
 * Reusable WhatsApp Inquiry CTA
 *
 * Reads the business WhatsApp number centrally from StoreSettings (backed by
 * Supabase `store_settings` when configured, falling back to SITE_CONFIG).
 */
export function WhatsAppInquiryButton({
  product,
  selectedColor,
  customMessage,
  label = 'Inquire on WhatsApp',
  variant = 'primary',
  className = '',
  fullWidth = false,
}: WhatsAppInquiryButtonProps) {
  const { settings } = useStoreSettings();

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : product
        ? `/collection/${product.slug}`
        : '/';

  const message = product
    ? generateProductInquiryMessage({
        product,
        pageUrl: currentUrl,
        selectedColor,
        brandName: settings.businessName,
      })
    : (customMessage ??
      `Hello ${settings.businessName}, I would like to inquire about your furniture collection.`);

  const href = buildWhatsAppInquiryUrl(
    message,
    settings.whatsappNumber || SITE_CONFIG.whatsapp.phoneNumber
  );

  const baseClasses =
    variant === 'nav'
      ? 'inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C735B]'
      : 'inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-medium tracking-wide transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C735B]';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={product ? `${label} about ${product.name}` : label}
      className={`${baseClasses} ${VARIANT_CLASSES[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <MessageCircle className="h-4 w-4 shrink-0 stroke-[1.75]" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}
