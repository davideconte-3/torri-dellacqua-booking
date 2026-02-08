import { NextRequest, NextResponse } from 'next/server';

const MENU_HOST = process.env.MENU_DOMAIN || 'menu.torridellacqua.it';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || request.nextUrl.hostname;
  const pathname = request.nextUrl.pathname;

  if (host === MENU_HOST && (pathname === '/' || pathname === '')) {
    return NextResponse.rewrite(new URL('/menu', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
