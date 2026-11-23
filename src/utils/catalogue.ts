import { SITE_CONFIG } from '../config/site';
import type {
  BuildType,
  Category,
  CategorySlug,
  Product,
  ProductDimensions,
  ProductFilterCriteria,
} from '../types/furniture';

/**
 * Formats a numeric Kenyan Shilling amount consistently across the application.
 * Defaults to SITE_CONFIG currency settings.
 */
export function formatKesPrice(
  amount: number,
  currencyCode: string = SITE_CONFIG.currency.symbol,
  locale: string = SITE_CONFIG.currency.locale
): string {
  const rounded = Math.round(amount);
  const formattedNumber = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(rounded);
  return `${currencyCode} ${formattedNumber}`;
}

/**
 * Human-readable build classification label.
 */
export function getBuildTypeLabel(buildType: BuildType): string {
  switch (buildType) {
    case 'ready-made':
      return 'Ready-Made';
    case 'custom-made':
      return 'Custom-Made';
    case 'both':
      return 'Ready-Made & Custom';
  }
}

/**
 * Formats dimensions into a clean architectural specification string.
 */
export function formatDimensions(dimensions: ProductDimensions): string {
  return `${dimensions.widthCm} × ${dimensions.depthCm} × ${dimensions.heightCm} cm`;
}

/**
 * Pure filtering logic for catalogue search, category, and build-type tabs.
 */
export function filterProducts(
  products: Product[],
  criteria: ProductFilterCriteria
): Product[] {
  const normalizedQuery = (criteria.query ?? '').trim().toLowerCase();
  const category = criteria.category ?? 'all';
  const buildType = criteria.buildType ?? 'all';

  return products.filter((product) => {
    if (category !== 'all' && product.categorySlug !== category) {
      return false;
    }

    if (buildType === 'ready-made') {
      if (product.buildType !== 'ready-made' && product.buildType !== 'both') {
        return false;
      }
    } else if (buildType === 'custom-made') {
      if (product.buildType !== 'custom-made' && product.buildType !== 'both') {
        return false;
      }
    }

    if (normalizedQuery.length > 0) {
      const searchable = [
        product.name,
        product.categoryName,
        product.shortSummary,
        product.description,
        product.specifications.frameMaterial,
        product.specifications.upholsteryOrFinish,
      ]
        .join(' ')
        .toLowerCase();

      if (!searchable.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Validates and resolves a category slug from URL search params.
 */
export function resolveCategorySlug(
  rawSlug: string | null | undefined,
  categories: Category[]
): CategorySlug | 'all' {
  if (!rawSlug || rawSlug === 'all') {
    return 'all';
  }
  const match = categories.find((c) => c.slug === rawSlug);
  return match ? match.slug : 'all';
}
