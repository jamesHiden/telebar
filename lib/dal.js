import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getSessionPayload } from './session';
import { getCustomerById } from './db';

export const verifySession = cache(async () => {
  const session = await getSessionPayload();
  if (!session?.customerId) {
    redirect('/login');
  }
  return { customerId: session.customerId, isAdmin: Boolean(session.isAdmin) };
});

export const verifyAdminSession = cache(async () => {
  const session = await verifySession();
  if (!session.isAdmin) {
    redirect('/dashboard');
  }
  return session;
});

export const getCurrentCustomer = cache(async () => {
  const session = await verifySession();
  return getCustomerById(session.customerId);
});
