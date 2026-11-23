import type { ShowroomConfig } from '../types/furniture';

/**
 * Central Showroom Configuration
 *
 * Update brand identity, currency, WhatsApp contact number, showroom address,
 * and fulfilment policies here without modifying individual UI components.
 */
export const SITE_CONFIG: ShowroomConfig = {
  brandName: 'Maison Living',
  tagline: 'Contemporary Kenyan Furniture & Bespoke Joinery',
  market: 'Kenya',
  currency: {
    code: 'KES',
    symbol: 'KES',
    locale: 'en-KE',
  },
  whatsapp: {
    // Central international format without '+' for wa.me links (demonstration number)
    phoneNumber: '254700000000',
    displayPhone: '+254 700 000 000',
    defaultGreeting: 'Hello Maison Living, I would like to inquire about your furniture collection.',
  },
  contact: {
    email: 'concierge@maisonliving.co.ke',
    phone: '+254 700 000 000',
    addressLine1: 'Hardy Design Courtyard, Ushirika Road, Karen',
    addressLine2: 'Nairobi, Kenya',
    hours: 'Monday – Saturday, 9:00 AM – 6:00 PM EAT',
    sundayHours: 'Sunday by private showroom appointment',
  },
  fulfilment: {
    nairobiDelivery: 'White-glove delivery and in-room placement across Nairobi within 2–4 business days for ready-made pieces.',
    regionalDelivery: 'Scheduled blanket-wrapped freight across Kenya including Mombasa, Nanyuki, Naivasha, Nakuru, Kisumu, and Eldoret.',
    collection: 'Complimentary showroom and workshop collection available from our Karen courtyard by prior scheduling.',
  },
  demoDisclaimer:
    'Demonstration Prototype (Milestone 1) — Product catalog, KES pricing, and showroom availability shown are curated sample data.',
  navigation: [
    { label: 'Home', path: '/' },
    { label: 'Collection', path: '/collection' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ],
};
