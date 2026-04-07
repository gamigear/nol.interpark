type CardImageProps = {
  src: string;
  alt: string;
  wide?: boolean;
};

export function CardImage({ src, alt, wide = false }: CardImageProps) {
  return (
    <div className={`card-image${wide ? ' card-image--wide' : ''}`}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}
