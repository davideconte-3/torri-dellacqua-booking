import { NextRequest, NextResponse } from 'next/server';

const MENU_HOST = process.env.MENU_DOMAIN || 'menu.torridellacqua.it';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || request.nextUrl.hostname;
  const pathname = request.nextUrl.pathname;

  if (pathname === '/menu' && host !== MENU_HOST) {
    const menuUrl = new URL('/', request.url);
    menuUrl.host = MENU_HOST;
    menuUrl.protocol = request.nextUrl.protocol || 'https:';
    return NextResponse.redirect(menuUrl);
  }

  if (host === MENU_HOST && (pathname === '/' || pathname === '')) {
    return NextResponse.rewrite(new URL('/menu', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/menu'],
};
