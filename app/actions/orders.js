'use server';

import { verifySession } from '@/lib/dal';
import { getProduct, createOrder } from '@/lib/db';
import { CUTOFF_HOUR } from '@/lib/constants';

export async function submitOrder(cart) {
  const session = await verifySession();

  if (!Array.isArray(cart) || cart.length === 0) {
    return { error: 'سبد سفارش خالیه.' };
  }

  const items = [];
  for (const line of cart) {
    const product = await getProduct(line.productId);
    const quantity = Number(line.quantity);
    if (!product || !product.active || !quantity || quantity <= 0) continue;
    items.push({
      name: product.name,
      unit: product.unit,
      unitPrice: product.price,
      quantity,
      subtotal: Math.round(quantity * product.price),
    });
  }

  if (items.length === 0) {
    return { error: 'هیچ کالای معتبری در سبد نیست.' };
  }

  const orderId = await createOrder(session.customerId, items);
  const total = items.reduce((sum, i) => sum + i.subtotal, 0);
  const pastCutoff = new Date().getHours() >= CUTOFF_HOUR;

  return { orderId, total, pastCutoff };
}
