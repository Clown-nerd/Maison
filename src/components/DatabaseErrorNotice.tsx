import { AlertCircle, RotateCcw } from 'lucide-react';

interface DatabaseErrorNoticeProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/**
 * Explicit error notice surfaced when Supabase queries fail, ensuring database
 * issues are communicated clearly instead of silently hidden.
 */
export function DatabaseErrorNotice({
  title = 'Unable to load showroom data',
  message,
  onRetry,
}: DatabaseErrorNoticeProps) {
  return (
    <div
      role="alert"
      className="border border-[#8C735B]/45 bg-white px-6 py-5 text-[#292723]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-[#8C735B]"
            aria-hidden="true"
          />
          <div>
            <p className="font-serif text-lg font-medium text-[#292723]">{title}</p>
            <p className="mt-1 text-sm text-[#292723]/75">{message}</p>
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 border border-[#292723]/30 bg-transparent px-4 py-2 text-xs font-medium tracking-wide text-[#292723] transition-colors hover:border-[#292723] hover:bg-[#292723] hover:text-[#F5F1E9] whitespace-nowrap shrink-0 self-start sm:self-center"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Retry</span>
          </button>
        )}
      </div>
    </div>
  );
}
