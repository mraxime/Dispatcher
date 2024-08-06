import { NextResponse, type NextMiddleware, type NextRequest } from 'next/server';

import { ROUTES } from 'src/lib/constants/routes';
import { isCompanyPath } from 'src/lib/utils/navigation';

/**
 * Simple server middleware authentification guard.
 *  1. Redirect /connexion to /dashboard/profile if token is found and valid.
 *  2. Redirect /dashboard/* to /connexion if token is not found or invalid.
 */
export const middleware: NextMiddleware = async (request) => {
	const token = request.cookies.get('access_token');

	if (request.nextUrl.pathname.startsWith('/connexion')) {
		if (!token) return NextResponse.next();

		const url = request.nextUrl.clone();
		url.pathname = ROUTES.DashboardPage();
		return NextResponse.redirect(url);
	}

	if (request.nextUrl.pathname.startsWith('/dashboard')) {
		// eslint-disable-next-line unicorn/no-lonely-if
		if (!token) return notAuthorizedResponse(request);

		// Validating the token
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/users/me`, {
				method: 'GET',
				headers: { Authorization: `Bearer ${token.value}` },
			});
			if (!response.ok) return notAuthorizedResponse(request);
		} catch {
			return notAuthorizedResponse(request);
		}
	}

	// Company paths guard
	if (request.nextUrl.pathname.startsWith('/dashboard')) {
		const pathname = request.nextUrl.pathname;
		const requireCompany = isCompanyPath(pathname);

		if (requireCompany && !request.cookies.has('company')) {
			const url = request.nextUrl.clone();
			url.pathname = ROUTES.DashboardPage();
			return NextResponse.redirect(url);
		}
	}

	// todo: super admin paths guard

	const response = NextResponse.next();
	return response;
};

export const config = {
	matcher: ['/connexion/:path*', '/dashboard/:path*'],
};

const notAuthorizedResponse = (request: NextRequest) => {
	const url = request.nextUrl.clone();
	url.pathname = ROUTES.LoginPage();

	// new response instance
	const response = NextResponse.redirect(url);
	response.cookies.delete('access_token');

	return response;
};
