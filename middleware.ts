import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose' // Using Jose for Edge compatibility

// Secret key from env
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

// Protected Routes Defs
const GOV_ROUTES = /^\/dashboard\/gov/;
const CITIZEN_ROUTES = /^\/dashboard\/citizen/;
const GOV_API_ROUTES = /^\/api\/gov/;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Skip public assets and auth routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/api/auth/login') ||
        pathname.startsWith('/api/auth/register') ||
        pathname === '/login' ||
        pathname === '/'
    ) {
        return NextResponse.next();
    }

    // 2. Verify Token
    const token = request.cookies.get('token')?.value;

    if (!token) {
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/api')) {
            // API generic 401
            if (pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            // Redirect to login
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    try {
        const { payload }: any = await jwtVerify(token, SECRET_KEY);
        const role = payload.role; // citizen, gov

        // 3. RBAC Enforcement mechanisms

        // GOV ROUTES -> Must be a gov role
        if (GOV_ROUTES.test(pathname) || GOV_API_ROUTES.test(pathname)) {
            if (role !== 'gov') {
                if (pathname.startsWith('/api')) {
                    return NextResponse.json({ error: 'Forbidden: Government Access Only' }, { status: 403 });
                }
                return NextResponse.redirect(new URL('/dashboard/citizen', request.url));
            }
        }

        // CITIZEN ROUTES -> Must be citizen (or maybe gov can view? Policy says gov views via their own dashboard)
        // Strictly, let's keep citizens in citizen dash.
        if (CITIZEN_ROUTES.test(pathname)) {
            if (role !== 'citizen') {
                if (pathname.startsWith('/api')) {
                    return NextResponse.json({ error: 'Forbidden: Citizen Access Only' }, { status: 403 });
                }
                // Redirect gov users to their dash if they try accessing citizen pages
                return NextResponse.redirect(new URL('/dashboard/gov', request.url));
            }
        }

        // Pass user info via headers for API routes ease of use (optional but helpful)
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.id as string);
        requestHeaders.set('x-user-role', payload.role as string);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

    } catch (err) {
        // Token invalid/expired
        if (pathname.startsWith('/api')) {
            return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/api/:path*'],
}
