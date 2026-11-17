import { useState } from 'react';
import { Pill } from 'lucide-react';

interface DemoImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function DemoImage({ src, alt, className = '' }: DemoImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F6FBF8] to-emerald-50 text-[#0B6E4F] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Pill className="w-8 h-8 mb-2 opacity-75" />
        <span className="text-xs font-medium text-slate-600 line-clamp-2 max-w-[180px]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
