'use server';

import { verifyAdminSession } from '@/lib/dal';
import { upsertProduct, deactivateProduct, markOrderDelivered, markAllPendingDelivered, recordPayment } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { DEFAULT_EMOJI } from '@/lib/constants';

export async function upsertProductAction(prevState, formData) {
  await verifyAdminSession();

  const name = String(formData.get('name') || '').trim();
  const price = Number(formData.get('price'));
  const qty = Number(formData.get('qty'));
  const unit = String(formData.get('unit') || 'کیلوگرم').trim();
  const category = String(formData.get('category') || 'all').trim();
  const emoji = String(formData.get('emoji') || '').trim() || DEFAULT_EMOJI;
  const imageUrl = String(formData.get('imageUrl') || '').trim() || null;
  const bulk = formData.get('bulk') === 'on';

  if (!name || !price || price <= 0 || Number.isNaN(qty)) {
    return { error: 'مقادیر وارد شده معتبر نیست.' };
  }

  await upsertProduct(name, price, qty, unit || 'کیلوگرم', category, emoji, imageUrl, bulk);
  revalidatePath('/admin');
  return { success: true };
}

export async function deactivateProductAction(productId) {
  await verifyAdminSession();
  await deactivateProduct(productId);
  revalidatePath('/admin');
}

export async function deliverOrderAction(orderId) {
  await verifyAdminSession();
  const order = await markOrderDelivered(orderId);
  revalidatePath('/admin');
  return { ok: Boolean(order) };
}

export async function deliverAllAction() {
  await verifyAdminSession();
  const delivered = await markAllPendingDelivered();
  revalidatePath('/admin');
  return { count: delivered.length };
}

export async function recordPaymentAction(customerId, amount) {
  await verifyAdminSession();
  const value = Number(amount);
  if (!value || value <= 0) {
    return { error: 'مبلغ نامعتبره.' };
  }
  const customer = await recordPayment(customerId, value, 'پرداخت نقدی');
  revalidatePath('/admin');
  return { customer };
}
