import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../types/furniture';
import { formatKesPrice, getBuildTypeLabel } from '../utils/catalogue';
import { ShowroomImage } from './ShowroomImage';

interface ProductCardProps {
  product: Product;
}

/**
 * Editorial Furniture Product Card
 * Uses uniform 4:3 photography, clean unboxed metadata separators, and tabular KES pricing.
 */
export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0];

  return (
    <Link
      to={`/collection/${product.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C735B]"
    >
      <div className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5">
        <div className="overflow-hidden bg-[#EBE4D6]">
          <ShowroomImage
            src={primaryImage?.url ?? ''}
            alt={primaryImage?.alt ?? product.name}
            aspectClassName="aspect-[4/3]"
            className="group-hover:[&_img]:scale-[1.03]"
          />
        </div>

        <div className="pt-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#8C735B]">
            <span>{product.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>{getBuildTypeLabel(product.buildType)}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#292723]/75">{product.availability}</span>
          </div>

          <div className="mt-1.5 flex items-baseline justify-between gap-4">
            <h3 className="font-serif text-xl font-medium leading-snug text-[#292723] transition-colors group-hover:text-[#8C735B]">
              {product.name}
            </h3>
            <span className="shrink-0 text-sm font-medium text-[#292723] tabular-nums">
              {formatKesPrice(product.priceKes)}
            </span>
          </div>

          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#292723]/70">
            {product.shortSummary}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#292723] underline decoration-[#8C735B]/50 underline-offset-4 transition-colors group-hover:text-[#8C735B] group-hover:decoration-[#8C735B]">
            <span>View Details</span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
