import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ShowroomImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  priority?: boolean;
}

/**
 * Resilient architectural photography frame with graceful fallback container.
 */
export function ShowroomImage({
  src,
  alt,
  className = '',
  aspectClassName = 'aspect-[4/3]',
  priority = false,
}: ShowroomImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-[#EBE4D6] text-[#8C735B] ${aspectClassName} ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-6 w-6 stroke-[1.5] opacity-70" aria-hidden="true" />
        <span className="mt-2 px-4 text-center text-xs tracking-wide text-[#292723]/70">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#EBE4D6] ${aspectClassName} ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        onError={() => setHasError(true)}
        className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      />
    </div>
  );
}
