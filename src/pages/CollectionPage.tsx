import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { DatabaseErrorNotice } from '../components/DatabaseErrorNotice';
import { ProductCard } from '../components/ProductCard';
import { SITE_CONFIG } from '../config/site';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { catalogueRepository } from '../services/catalogueRepository';
import type { Category, CategorySlug, Product } from '../types/furniture';
import { filterProducts, resolveCategorySlug } from '../utils/catalogue';

type BuildFilter = 'all' | 'ready-made' | 'custom-made';

export function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings } = useStoreSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);

  const rawCategory = searchParams.get('category');
  const rawBuild = searchParams.get('build');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') ?? '');

  const handleRetry = useCallback(() => {
    setRetryTick((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    Promise.all([
      catalogueRepository.getCategories(),
      catalogueRepository.getProducts(),
    ])
      .then(([cats, items]) => {
        if (!active) return;
        setCategories(cats);
        setProducts(items);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load the showroom collection.'
        );
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryTick]);

  const activeCategory: CategorySlug | 'all' = useMemo(
    () => resolveCategorySlug(rawCategory, categories),
    [rawCategory, categories]
  );

  const activeBuildFilter: BuildFilter =
    rawBuild === 'ready-made' || rawBuild === 'custom-made' ? rawBuild : 'all';

  const filteredProducts = useMemo(
    () =>
      filterProducts(products, {
        category: activeCategory,
        query: searchQuery,
        buildType: activeBuildFilter,
      }),
    [products, activeCategory, searchQuery, activeBuildFilter]
  );

  const updateCategory = (slug: CategorySlug | 'all') => {
    const next = new URLSearchParams(searchParams);
    if (slug === 'all') {
      next.delete('category');
    } else {
      next.set('category', slug);
    }
    setSearchParams(next, { replace: true });
  };

  const updateBuildFilter = (build: BuildFilter) => {
    const next = new URLSearchParams(searchParams);
    if (build === 'all') {
      next.delete('build');
    } else {
      next.set('build', build);
    }
    setSearchParams(next, { replace: true });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSearchParams({}, { replace: true });
  };

  const activeCategoryObj = categories.find((c) => c.slug === activeCategory);
  const hasActiveFilters =
    activeCategory !== 'all' || activeBuildFilter !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="bg-[#F5F1E9] pb-24">
      {/* Editorial Collection Header */}
      <section className="border-b border-[#292723]/10 bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <p className="text-xs font-medium tracking-wide text-[#8C735B]">
            Furniture Catalogue
          </p>
          <h1 className="mt-2 font-serif text-4xl font-normal text-[#292723] sm:text-5xl">
            {activeCategoryObj ? activeCategoryObj.name : 'Complete Collection'}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#292723]/75">
            {activeCategoryObj
              ? activeCategoryObj.description
              : 'Explore our signature sofas, beds, dining tables, office pieces, wardrobes, TV stands, and outdoor terrace designs crafted for Kenyan living.'}
          </p>
          {settings.isDemoContent && (
            <p className="mt-4 text-xs text-[#8C735B]">
              {SITE_CONFIG.demoDisclaimer}
            </p>
          )}
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="border-b border-[#292723]/10 bg-[#F5F1E9] py-6">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 space-y-5">
          {/* Top row: Search + Ready-made / Custom-made segmented control */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <label htmlFor="catalogue-search" className="sr-only">
                Search furniture collection
              </label>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#292723]/50"
                aria-hidden="true"
              />
              <input
                id="catalogue-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sofas, walnut, rattan, dining..."
                className="w-full border border-[#292723]/20 bg-white py-2.5 pl-10 pr-10 text-sm text-[#292723] placeholder:text-[#292723]/45 focus:border-[#292723] focus:outline-none"
              />
              {searchQuery.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#292723]/55 hover:text-[#292723]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div
              role="group"
              aria-label="Filter by build option"
              className="inline-flex border border-[#292723]/15 bg-white p-1 self-start"
            >
              {(
                [
                  { id: 'all', label: 'All Formats' },
                  { id: 'ready-made', label: 'Ready-Made' },
                  { id: 'custom-made', label: 'Custom-Made' },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateBuildFilter(option.id)}
                  aria-pressed={activeBuildFilter === option.id}
                  className={`px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    activeBuildFilter === option.id
                      ? 'bg-[#292723] text-[#F5F1E9]'
                      : 'text-[#292723]/70 hover:text-[#292723]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div
            role="tablist"
            aria-label="Furniture categories"
            className="flex flex-wrap items-center gap-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'all'}
              onClick={() => updateCategory('all')}
              className={`px-4 py-2 text-xs font-medium tracking-wide transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-[#292723] text-[#F5F1E9]'
                  : 'border border-[#292723]/15 bg-white text-[#292723]/80 hover:border-[#292723]/40 hover:text-[#292723]'
              }`}
            >
              All Pieces
            </button>

            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                role="tab"
                aria-selected={activeCategory === category.slug}
                onClick={() => updateCategory(category.slug)}
                className={`px-4 py-2 text-xs font-medium tracking-wide transition-colors whitespace-nowrap shrink-0 ${
                  activeCategory === category.slug
                    ? 'bg-[#292723] text-[#F5F1E9]'
                    : 'border border-[#292723]/15 bg-white text-[#292723]/80 hover:border-[#292723]/40 hover:text-[#292723]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-[1280px] px-6 pt-10 lg:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[#292723]/75 tabular-nums">
            {isLoading
              ? 'Loading collection...'
              : `Showing ${filteredProducts.length} ${
                  filteredProducts.length === 1 ? 'piece' : 'pieces'
                }`}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-medium text-[#8C735B] underline underline-offset-4 hover:text-[#292723]"
            >
              Clear all filters
            </button>
          )}
        </div>

        {error ? (
          <DatabaseErrorNotice
            title="Unable to load furniture catalogue"
            message={error}
            onRetry={handleRetry}
          />
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="animate-pulse">
                <div className="aspect-[4/3] bg-[#D9C8B2]/45" />
                <div className="mt-4 h-3 w-32 bg-[#D9C8B2]/45" />
                <div className="mt-2 h-6 w-3/4 bg-[#D9C8B2]/45" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="border border-[#292723]/15 bg-white px-6 py-16 text-center">
            <h2 className="font-serif text-2xl font-normal text-[#292723]">
              The showroom catalogue is currently being curated
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#292723]/70">
              No published furniture pieces are currently listed. Contact our Nairobi showroom via WhatsApp for floor availability and custom commissions.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="border border-[#292723]/15 bg-white px-6 py-16 text-center">
            <h2 className="font-serif text-2xl font-normal text-[#292723]">
              No matching furniture pieces found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#292723]/70">
              Try adjusting your search term or category filter, or clear all filters to browse the full catalogue.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 bg-[#292723] px-6 py-3 text-xs font-medium tracking-wide text-[#F5F1E9] transition-colors hover:bg-[#8C735B]"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
