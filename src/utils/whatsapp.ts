import { SITE_CONFIG } from '../config/site';
import { formatKesPrice, getBuildTypeLabel } from './catalogue';
import type { Product } from '../types/furniture';

export interface ProductInquiryParams {
  product: Product;
  pageUrl: string;
  selectedColor?: string;
  brandName?: string;
}

export interface GeneralInquiryParams {
  name?: string;
  topic?: string;
  fulfilmentMethod?: 'Delivery' | 'Showroom Collection';
  notes?: string;
  brandName?: string;
}

/**
 * Normalizes a configured phone number string to digits-only for wa.me links.
 */
export function sanitizeWhatsAppNumber(phoneNumber: string): string {
  return phoneNumber.replace(/[^\d]/g, '');
}

/**
 * Builds an encoded https://wa.me/<number>?text=... URL from central config.
 */
export function buildWhatsAppInquiryUrl(
  message: string,
  phoneNumber: string = SITE_CONFIG.whatsapp.phoneNumber
): string {
  const digits = sanitizeWhatsAppNumber(phoneNumber);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a structured pre-filled WhatsApp inquiry message for an individual product.
 */
export function generateProductInquiryMessage({
  product,
  pageUrl,
  selectedColor,
  brandName = SITE_CONFIG.brandName,
}: ProductInquiryParams): string {
  const lines = [
    `Hello ${brandName}, I would like to inquire about:`,
    `Product: ${product.name}`,
    `Listed Price: ${formatKesPrice(product.priceKes)}`,
    `Format: ${getBuildTypeLabel(product.buildType)} (${product.availability})`,
  ];

  if (selectedColor) {
    lines.push(`Preferred Finish / Colour: ${selectedColor}`);
  }

  lines.push(`Page Link: ${pageUrl}`);
  lines.push('');
  lines.push('Could you share availability, lead time, and Nairobi delivery or collection options?');

  return lines.join('\n');
}

/**
 * Generates a structured pre-filled WhatsApp inquiry message from the Contact composer.
 */
export function generateGeneralInquiryMessage({
  name,
  topic,
  fulfilmentMethod,
  notes,
  brandName = SITE_CONFIG.brandName,
}: GeneralInquiryParams): string {
  const lines = [`Hello ${brandName},`];

  if (name && name.trim().length > 0) {
    lines.push(`My name is ${name.trim()}.`);
  }

  if (topic && topic.trim().length > 0) {
    lines.push(`Inquiry Topic: ${topic.trim()}`);
  }

  if (fulfilmentMethod) {
    lines.push(`Preferred Fulfilment: ${fulfilmentMethod}`);
  }

  if (notes && notes.trim().length > 0) {
    lines.push(`Details: ${notes.trim()}`);
  } else {
    lines.push('I would like to schedule a consultation or learn more about your furniture collection.');
  }

  return lines.join('\n');
}
