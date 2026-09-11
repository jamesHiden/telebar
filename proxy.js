import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

const protectedPrefixes = ['/dashboard', '/admin', '/complete-profile'];
const authPages = ['/login', '/register'];

export async function proxy(req) {
  const path = req.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((p) => path.startsWith(p));
  const isAuthPage = authPages.includes(path);

  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  if (isProtected && !session?.customerId) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('next', path);
    return NextResponse.redirect(loginUrl);
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
