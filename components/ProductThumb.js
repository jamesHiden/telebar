import Image from 'next/image';

export default function ProductThumb({ product, size = 40, fill = false }) {
  const className = fill
    ? 'object-cover'
    : 'rounded-lg object-cover border border-[var(--border)] shrink-0';
  const style = fill ? undefined : { width: size, height: size, fontSize: size * 0.55 };

  if (product.image_url) {
    const isLocal = product.image_url.startsWith('/');

    if (isLocal) {
      return fill ? (
        <Image src={product.image_url} alt={product.name} fill sizes="(min-width: 1024px) 220px, 45vw" className={className} />
      ) : (
        <Image src={product.image_url} alt={product.name} width={size} height={size} className={className} style={{ width: size, height: size }} />
      );
    }

    return fill ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={product.image_url} alt={product.name} className={`${className} absolute inset-0 w-full h-full`} />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={product.image_url} alt={product.name} style={style} className={className} />
    );
  }

  return (
    <span
      style={fill ? undefined : style}
      className={
        fill
          ? 'absolute inset-0 flex items-center justify-center text-6xl bg-[var(--brand-light)]'
          : 'rounded-lg bg-[var(--brand-light)] flex items-center justify-center shrink-0'
      }
    >
      {product.emoji || '🥬'}
    </span>
  );
}
