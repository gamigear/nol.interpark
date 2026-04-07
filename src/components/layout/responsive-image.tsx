import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export type ResponsiveImageRatio = 'poster' | 'square' | 'wide' | 'hero';

type ResponsiveImageProps = {
  src: string;
  alt: string;
  ratio?: ResponsiveImageRatio;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

const ratioClassMap: Record<ResponsiveImageRatio, string> = {
  poster: 'aspect-[3/4] sm:aspect-[3/4]',
  square: 'aspect-square',
  wide: 'aspect-[16/10] md:aspect-[16/9]',
  hero: 'aspect-[5/6] sm:aspect-[4/5] md:aspect-[16/10] xl:aspect-[21/9]',
};

export function ResponsiveImage({
  src,
  alt,
  ratio = 'poster',
  className,
  priority = false,
  sizes,
}: ResponsiveImageProps) {
  const resolvedSizes =
    sizes ||
    (ratio === 'hero'
      ? '(min-width: 1280px) 1200px, (min-width: 1024px) 92vw, (min-width: 768px) 94vw, 100vw'
      : ratio === 'wide'
        ? '(min-width: 1280px) 40vw, (min-width: 1024px) 44vw, (min-width: 768px) 52vw, 86vw'
        : '(min-width: 1280px) 24vw, (min-width: 1024px) 28vw, (min-width: 768px) 38vw, 86vw');

  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-neutral-100', ratioClassMap[ratio], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={resolvedSizes}
        className="object-cover"
      />
    </div>
  );
}
