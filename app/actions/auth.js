'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { getCustomerByPhone, createCustomer } from '@/lib/db';
import { createSession, deleteSession } from '@/lib/session';
import { BUSINESS_TYPES } from '@/lib/constants';

const PHONE_REGEX = /^09\d{9}$/;

export async function signup(prevState, formData) {
  const name = String(formData.get('name') || '').trim();
  const shopName = String(formData.get('shopName') || '').trim();
  const businessType = String(formData.get('businessType') || '');
  const phone = String(formData.get('phone') || '').trim();
  const password = String(formData.get('password') || '');
  const address = String(formData.get('address') || '').trim();
  const lat = formData.get('lat') ? Number(formData.get('lat')) : null;
  const lng = formData.get('lng') ? Number(formData.get('lng')) : null;

  const errors = {};
  if (name.length < 2) errors.name = 'نام خیلی کوتاهه';
  if (shopName.length < 2) errors.shopName = 'نام مغازه رو وارد کنید';
  if (!BUSINESS_TYPES.some((t) => t.value === businessType)) errors.businessType = 'نوع کسب‌وکار رو انتخاب کنید';
  if (!PHONE_REGEX.test(phone)) errors.phone = 'شماره موبایل معتبر نیست (مثال: 09131234567)';
  if (password.length < 6) errors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشه';
  if (!address) errors.address = 'آدرس رو وارد کنید';

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  if (await getCustomerByPhone(phone)) {
    return { errors: { phone: 'این شماره قبلاً ثبت‌نام کرده. وارد شوید.' } };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const customer = await createCustomer({
    phone,
    passwordHash,
    name,
    shopName,
    businessType,
    address,
    lat,
    lng,
  });

  await createSession(customer.id, false);
  redirect('/dashboard');
}

export async function login(prevState, formData) {
  const phone = String(formData.get('phone') || '').trim();
  const password = String(formData.get('password') || '');

  const customer = await getCustomerByPhone(phone);
  if (!customer) {
    return { errors: { phone: 'شماره یا رمز عبور اشتباهه' } };
  }
  const valid = await bcrypt.compare(password, customer.password_hash);
  if (!valid) {
    return { errors: { phone: 'شماره یا رمز عبور اشتباهه' } };
  }

  await createSession(customer.id, Boolean(customer.is_admin));
  redirect(customer.is_admin ? '/admin' : '/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
