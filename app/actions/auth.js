'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import {
  getCustomerByPhone,
  createCustomerWithPhone,
  canRequestOtp,
  createOtp,
  verifyOtp,
  completeCustomerProfile,
} from '@/lib/db';
import { sendOtpSms } from '@/lib/sms';
import { createSession, deleteSession } from '@/lib/session';
import { verifySession } from '@/lib/dal';
import { BUSINESS_TYPES } from '@/lib/constants';

const PHONE_REGEX = /^09\d{9}$/;

export async function requestOtp(prevState, formData) {
  const phone = String(formData.get('phone') || '').trim();
  const next = String(formData.get('next') || '/');

  if (!PHONE_REGEX.test(phone)) {
    return { step: 'phone', next, errors: { phone: 'شماره موبایل معتبر نیست (مثال: 09131234567)' } };
  }

  const customer = await getCustomerByPhone(phone);
  if (customer?.is_admin) {
    return { step: 'password', phone, next };
  }

  const allowed = await canRequestOtp(phone);
  if (!allowed) {
    return { step: 'otp', phone, next, notice: 'کد قبلی هنوز معتبره — کمی صبر کنید یا همون کد رو وارد کنید.' };
  }

  const code = await createOtp(phone);
  await sendOtpSms(phone, code);

  return { step: 'otp', phone, next };
}

export async function verifyOtpAndLogin(prevState, formData) {
  const phone = String(formData.get('phone') || '').trim();
  const code = String(formData.get('code') || '').trim();
  const next = String(formData.get('next') || '/');

  const result = await verifyOtp(phone, code);
  if (!result.ok) {
    return { step: 'otp', phone, next, errors: { code: result.reason } };
  }

  let customer = await getCustomerByPhone(phone);
  if (!customer) {
    customer = await createCustomerWithPhone(phone);
  }

  await createSession(customer.id, Boolean(customer.is_admin));
  redirect(customer.is_admin ? '/admin' : next || '/');
}

export async function passwordLogin(prevState, formData) {
  const phone = String(formData.get('phone') || '').trim();
  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '/');

  const customer = await getCustomerByPhone(phone);
  if (!customer || !customer.password_hash) {
    return { step: 'phone', next, errors: { phone: 'شماره یا رمز اشتباهه' } };
  }
  const valid = await bcrypt.compare(password, customer.password_hash);
  if (!valid) {
    return { step: 'password', phone, next, errors: { password: 'رمز اشتباهه' } };
  }

  await createSession(customer.id, Boolean(customer.is_admin));
  redirect(customer.is_admin ? '/admin' : next || '/');
}

export async function completeProfile(prevState, formData) {
  const session = await verifySession();

  const name = String(formData.get('name') || '').trim();
  const shopName = String(formData.get('shopName') || '').trim();
  const businessType = String(formData.get('businessType') || '');
  const address = String(formData.get('address') || '').trim();
  const lat = formData.get('lat') ? Number(formData.get('lat')) : null;
  const lng = formData.get('lng') ? Number(formData.get('lng')) : null;
  const next = String(formData.get('next') || '/dashboard');

  const errors = {};
  if (name.length < 2) errors.name = 'نام خیلی کوتاهه';
  if (shopName.length < 2) errors.shopName = 'نام مغازه رو وارد کنید';
  if (!BUSINESS_TYPES.some((t) => t.value === businessType)) errors.businessType = 'نوع کسب‌وکار رو انتخاب کنید';
  if (!address) errors.address = 'آدرس رو وارد کنید';

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  await completeCustomerProfile(session.customerId, { name, shopName, businessType, address, lat, lng });
  redirect(next);
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
