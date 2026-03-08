import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Public paths that do not require authentication
    const isPublicPath = path === '/login' || path.startsWith('/api') || path.startsWith('/_next') || path.includes('favicon.ico');

    const token = request.cookies.get('slepicarna_auth')?.value;

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (path === '/login' && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
