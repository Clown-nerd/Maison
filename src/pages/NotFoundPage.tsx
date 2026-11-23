import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-28 text-center lg:px-10">
      <p className="text-xs font-medium tracking-wide text-[#8C735B]">
        404 · Page Not Found
      </p>
      <h1 className="mt-3 font-serif text-4xl font-normal text-[#292723] sm:text-5xl">
        This showroom page could not be found.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base text-[#292723]/75">
        Return to our homepage or browse the complete Kenyan furniture catalogue.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#292723] px-6 py-3.5 text-sm font-medium text-[#F5F1E9] hover:bg-[#8C735B]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/collection"
          className="inline-flex items-center border border-[#292723]/30 px-6 py-3.5 text-sm font-medium text-[#292723] hover:border-[#292723]"
        >
          Browse Collection
        </Link>
      </div>
    </div>
  );
}
