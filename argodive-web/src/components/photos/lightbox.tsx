'use client';

import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

type LightboxImage = {
  url: string;
  caption?: string;
  photographer?: string;
  date?: string;
};

type LightboxProps = {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function Lightbox({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const current = images[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white/80 hover:text-white"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Counter */}
      <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white/80">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/80 hover:text-white"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {/* Image */}
      <div className="flex max-h-[90vh] max-w-[90vw] flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={current.url}
          alt={current.caption || 'Inspection photo'}
          className="max-h-[80vh] max-w-full rounded-lg object-contain"
        />
        {current.caption && (
          <div className="mt-3 flex items-center gap-4 text-sm text-white/70">
            <span>{current.caption}</span>
            {current.photographer && <span>&middot; {current.photographer}</span>}
            {current.date && <span>&middot; {current.date}</span>}
            <a
              href={current.url}
              download
              className="ml-2 rounded-full bg-white/10 p-1.5 hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/80 hover:text-white"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}
    </div>
  );
}
