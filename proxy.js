import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

const protectedPrefixes = ['/dashboard', '/admin'];
const authPages = ['/login', '/register'];

export async function proxy(req) {
  const path = req.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((p) => path.startsWith(p));
  const isAuthPage = authPages.includes(path);

  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  if (isProtected && !session?.customerId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (path.startsWith('/admin') && session && !session.isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  if (isAuthPage && session?.customerId) {
    return NextResponse.redirect(new URL(session.isAdmin ? '/admin' : '/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:png|ico|svg)$).*)'],
};
