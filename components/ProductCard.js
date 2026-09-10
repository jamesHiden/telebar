'use client';

import ProductThumb from '@/components/ProductThumb';

const fmt = (n) => Number(n).toLocaleString('en-US');

export default function ProductCard({ product, quantity, onChange }) {
  const qty = Number(quantity) || 0;
  const step = product.unit === 'کیلوگرم' ? 0.5 : 1;

  function setQty(next) {
    const value = Math.max(0, next);
    onChange(value === 0 ? '' : value);
  }

  return (
    <div
      className={`group bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        qty > 0 ? 'border-[var(--brand)] ring-1 ring-[var(--brand)]' : 'border-[var(--border)]'
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--brand-light)]">
        <ProductThumb product={product} fill />
      </div>

      <div className="p-3 sm:p-4">
        <p className="font-bold truncate">{product.name}</p>
        <p className="text-sm text-[var(--muted)] mt-0.5">
          {fmt(product.price)} تومان / {product.unit}
        </p>

        <div className="mt-3 flex items-center justify-center gap-1 rounded-xl border border-[var(--border)] overflow-hidden">
          <button
            type="button"
            onClick={() => setQty(qty - step)}
            className="w-9 h-9 flex items-center justify-center text-lg font-bold text-[var(--brand-dark)] hover:bg-[var(--brand-light)] transition disabled:opacity-30"
            disabled={qty <= 0}
          >
            −
          </button>
          <input
            type="number"
            min="0"
            step={step}
            inputMode="decimal"
            value={quantity ?? ''}
            placeholder="۰"
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-w-0 text-center outline-none py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setQty(qty + step)}
            className="w-9 h-9 flex items-center justify-center text-lg font-bold text-white bg-[var(--brand)] hover:opacity-90 transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
