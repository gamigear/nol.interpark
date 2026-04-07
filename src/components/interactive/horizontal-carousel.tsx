'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type HorizontalCarouselProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  controlsLabel?: string;
};

export function HorizontalCarousel({ children, className, trackClassName, controlsLabel = 'Carousel controls' }: HorizontalCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(direction: 'prev' | 'next') {
    const node = trackRef.current;

    if (!node) {
      return;
    }

    const amount = Math.max(node.clientWidth * 0.85, 280);
    node.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
  }

  return (
    <div className={cn('carousel', className)}>
      <div className="carousel-head">
        <div className="carousel-controls" aria-label={controlsLabel}>
          <button type="button" onClick={() => scrollByAmount('prev')} aria-label="Scroll left">
            ←
          </button>
          <button type="button" onClick={() => scrollByAmount('next')} aria-label="Scroll right">
            →
          </button>
        </div>
      </div>
      <div ref={trackRef} className={cn('carousel-track', trackClassName)}>
        {children}
      </div>
    </div>
  );
}
