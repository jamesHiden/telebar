import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error('SESSION_SECRET تنظیم نشده. فایل .env.local را بررسی کنید.');
}
const encodedKey = new TextEncoder().encode(secretKey);
const SESSION_DAYS = 30;

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(encodedKey);
}

export async function decrypt(session) {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, { algorithms: ['HS256'] });
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(customerId, isAdmin) {
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const session = await encrypt({ customerId, isAdmin: Boolean(isAdmin) });
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getSessionPayload() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value;
  return decrypt(cookie);
}
