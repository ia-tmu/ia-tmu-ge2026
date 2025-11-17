import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales } from './app/i18n';
import { i18nRouter } from 'next-i18n-router';
import { i18nConfig } from "./app/i18n";

export function middleware(request: NextRequest) {
  return i18nRouter(request, i18nConfig);
}
//
// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//
//   if (
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/api') ||
//     pathname.includes('/favicon.ico') ||
//     pathname.includes('.')
//   ) {
//     return NextResponse.next();
//   }
//
//   const pathnameHasLocale = locales.some(
//     (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
//   );
//
//   if (!pathnameHasLocale) {
//     request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
//     return NextResponse.rewrite(request.nextUrl);
//   }
//
//   return NextResponse.next();
// }

export const config = {
  // matcher: ['/((?!_next|api|favicon.ico).*)'],
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
