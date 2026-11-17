import { useEffect, useState } from 'react';
import { Pill } from 'lucide-react';

interface DemoImageProps {
  src: string;
  alt: string;
  className?: string;
  compact?: boolean;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export function DemoImage({
  src,
  alt,
  className = '',
  compact = false,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
}: DemoImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F6FBF8] to-emerald-50 text-[#0B6E4F] text-center ${
          compact ? 'p-2' : 'p-4'
        } ${className}`}
        role="img"
        aria-label={alt}
      >
        <Pill className={compact ? 'w-6 h-6 opacity-75' : 'w-8 h-8 mb-2 opacity-75'} />
        {!compact && (
          <span className="text-xs font-medium text-slate-600 line-clamp-2 max-w-[180px]">
            {alt}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
