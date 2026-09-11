'use server';

import { verifySession } from '@/lib/dal';
import { getProduct, createOrder, getLastOrderItems, listActiveProducts, getCustomerById, isProfileComplete } from '@/lib/db';
import { CUTOFF_HOUR } from '@/lib/constants';

export async function submitOrder(cart) {
  const session = await verifySession();

  const customer = await getCustomerById(session.customerId);
  if (!isProfileComplete(customer)) {
    return { needsProfile: true };
  }

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

export async function repeatLastOrder() {
  const session = await verifySession();

  const customer = await getCustomerById(session.customerId);
  if (!isProfileComplete(customer)) {
    return { needsProfile: true };
  }

  const lastItems = await getLastOrderItems(session.customerId);
  if (lastItems.length === 0) {
    return { error: 'هنوز سفارشی ثبت نکردید که بشه تکرارش کرد.' };
  }

  const activeProducts = await listActiveProducts();
  const byName = new Map(activeProducts.map((p) => [p.name, p]));

  const items = [];
  const skipped = [];
  for (const line of lastItems) {
    const product = byName.get(line.product_name);
    if (!product) {
      skipped.push(line.product_name);
      continue;
    }
    items.push({
      name: product.name,
      unit: product.unit,
      unitPrice: product.price,
      quantity: line.quantity,
      subtotal: Math.round(line.quantity * product.price),
    });
  }

  if (items.length === 0) {
    return { error: 'محصولات سفارش قبلی دیگه موجود نیستن.' };
  }

  const orderId = await createOrder(session.customerId, items);
  const total = items.reduce((sum, i) => sum + i.subtotal, 0);
  const pastCutoff = new Date().getHours() >= CUTOFF_HOUR;

  return { orderId, total, pastCutoff, skipped };
}
