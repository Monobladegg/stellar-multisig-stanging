// middleware.js
import { NextResponse } from 'next/server';

interface request {
  nextUrl: any;
  cookies: any;
}

export function middleware(request: request) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;
  const network = request.cookies.get('network') || 'public';

  // Redirect from the root to the appropriate network
  if (pathname === '/') {
    url.pathname = `/${network}`;
    return NextResponse.redirect(url);
  }

  // Ensure the URL starts with the network prefix
  if (!pathname.startsWith(`/${network}`) && !pathname.startsWith('/_next') && !pathname.startsWith('/favicon.ico')) {
    url.pathname = `/${network}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
