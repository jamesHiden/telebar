export default function ProductThumb({ product, size = 40 }) {
  const style = { width: size, height: size, fontSize: size * 0.55 };

  if (product.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.image_url}
        alt={product.name}
        style={style}
        className="rounded-lg object-cover border border-[var(--border)] shrink-0"
      />
    );
  }

  return (
    <span
      style={style}
      className="rounded-lg bg-[var(--brand-light)] flex items-center justify-center shrink-0"
    >
      {product.emoji || '🥬'}
    </span>
  );
}
