import test from 'node:test';
import assert from 'node:assert/strict';
import { SAMPLE_CATEGORIES, SAMPLE_PRODUCTS } from '../data/sampleCatalogue';
import { SITE_CONFIG } from '../config/site';
import {
  filterProducts,
  formatDimensions,
  formatKesPrice,
  getBuildTypeLabel,
  resolveCategorySlug,
} from './catalogue';
import {
  buildWhatsAppInquiryUrl,
  generateGeneralInquiryMessage,
  generateProductInquiryMessage,
  sanitizeWhatsAppNumber,
} from './whatsapp';

test('formatKesPrice formats Kenyan Shillings cleanly without decimals', () => {
  assert.equal(formatKesPrice(185000, 'KES', 'en-KE'), 'KES 185,000');
  assert.equal(formatKesPrice(68000, 'KES', 'en-KE'), 'KES 68,000');
});

test('getBuildTypeLabel maps ready-made, custom-made, and hybrid labels', () => {
  assert.equal(getBuildTypeLabel('ready-made'), 'Ready-Made');
  assert.equal(getBuildTypeLabel('custom-made'), 'Custom-Made');
  assert.equal(getBuildTypeLabel('both'), 'Ready-Made & Custom');
});

test('formatDimensions renders W x D x H in centimetres', () => {
  assert.equal(
    formatDimensions({ widthCm: 228, depthCm: 96, heightCm: 78 }),
    '228 × 96 × 78 cm'
  );
});

test('sample catalogue covers all 7 required categories with valid product media', () => {
  const slugs = SAMPLE_CATEGORIES.map((c) => c.slug);
  assert.deepEqual(slugs, [
    'sofas',
    'beds',
    'dining-furniture',
    'office-furniture',
    'wardrobes',
    'tv-stands',
    'outdoor-furniture',
  ]);

  for (const slug of slugs) {
    const itemsInCategory = SAMPLE_PRODUCTS.filter((p) => p.categorySlug === slug);
    assert.ok(itemsInCategory.length >= 2, `Expected >=2 products for category ${slug}`);
  }

  for (const product of SAMPLE_PRODUCTS) {
    assert.ok(product.images.length >= 2, `Expected >=2 photos for ${product.name}`);
    assert.ok(product.colors.length >= 1, `Expected >=1 color for ${product.name}`);
    assert.equal(product.isDemoContent, true);
  }
});

test('filterProducts filters by category, buildType, and search query', () => {
  const sofas = filterProducts(SAMPLE_PRODUCTS, { category: 'sofas' });
  assert.equal(sofas.length, 2);
  assert.ok(sofas.every((p) => p.categorySlug === 'sofas'));

  const customOnly = filterProducts(SAMPLE_PRODUCTS, { buildType: 'custom-made' });
  assert.ok(customOnly.every((p) => p.buildType === 'custom-made' || p.buildType === 'both'));

  const searchRattan = filterProducts(SAMPLE_PRODUCTS, { query: 'rattan' });
  assert.ok(searchRattan.some((p) => p.slug === 'lamu-cane-walnut-platform-bed'));

  const noMatch = filterProducts(SAMPLE_PRODUCTS, { query: 'nonexistent-item-xyz' });
  assert.equal(noMatch.length, 0);
});

test('resolveCategorySlug validates URL query strings safely', () => {
  assert.equal(resolveCategorySlug('tv-stands', SAMPLE_CATEGORIES), 'tv-stands');
  assert.equal(resolveCategorySlug('unknown-cat', SAMPLE_CATEGORIES), 'all');
  assert.equal(resolveCategorySlug(undefined, SAMPLE_CATEGORIES), 'all');
});

test('WhatsApp helpers use central configuration and encode product URL & details', () => {
  assert.equal(sanitizeWhatsAppNumber('+254 700 000 000'), '254700000000');

  const product = SAMPLE_PRODUCTS[0];
  const pageUrl = 'https://maisonliving.co.ke/collection/karen-boucle-three-seater-sofa';
  const msg = generateProductInquiryMessage({
    product,
    pageUrl,
    selectedColor: 'Oatmeal Linen',
  });

  assert.ok(msg.includes(product.name));
  assert.ok(msg.includes('Oatmeal Linen'));
  assert.ok(msg.includes(pageUrl));
  assert.ok(msg.includes('KES 185,000'));

  const waUrl = buildWhatsAppInquiryUrl(msg);
  assert.ok(
    waUrl.startsWith(`https://wa.me/${sanitizeWhatsAppNumber(SITE_CONFIG.whatsapp.phoneNumber)}?text=`)
  );

  const generalMsg = generateGeneralInquiryMessage({
    name: 'Amina',
    topic: 'Custom Dining Table',
    fulfilmentMethod: 'Delivery',
    notes: 'Eight seater in solid walnut for Karen.',
  });
  assert.ok(generalMsg.includes('Amina'));
  assert.ok(generalMsg.includes('Custom Dining Table'));
  assert.ok(generalMsg.includes('Delivery'));
});
