import { NextResponse, type NextMiddleware, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { ROUTES } from 'src/lib/constants/routes';
import { getSession } from 'src/server/auth';
import { db } from 'src/server/database';
import { usersTable } from 'src/server/database/schema';

/**
 * NOTE: This middleware is currently disabled and has no effect.
 * Next.js middleware only runs on edge runtime which brings some
 * incompatibility on various packages we use like oslo/password.
 *
 * To re-enable this middleware, remove the dot (.) in the filename.
 * Maybe it will work after some updates...
 *
 * UPDATE: this issue might be fixed soon...
 * see: https://github.com/vercel/next.js/issues/63850
 * and  https://github.com/pilcrowOnPaper/oslo/pull/69
 */

/**
 * Server middleware which runs on every requests.
 */
export const middleware: NextMiddleware = async (request) => {
	/**
	 * Login Page Guard.
	 *  1. If session is found, redirect to dashboard page.
	 *  2. If session is NOT found, let the user login.
	 */
	if (request.nextUrl.pathname.startsWith('/connexion')) {
		try {
			const { user } = await getSession();
			if (!user) return NextResponse.next();
			const url = request.nextUrl.clone();
			url.pathname = ROUTES.DashboardPage();
			return NextResponse.redirect(url);
		} catch {
			return NextResponse.next();
		}
	}

	/**
	 * Dashboard Pages Guard.
	 *  1. If session is NOT found, redirect to login page.
	 *  2. Autoselect an appropriate company if empty.
	 */
	if (request.nextUrl.pathname.startsWith('/dashboard')) {
		try {
			const { user } = await getSession();
			if (!user) return UnauthorizedResponse(request);

			// Autoselect an appropriate company if empty
			if (!user.selectedCompanyId) {
				await db
					.update(usersTable)
					.set({ selectedCompanyId: user.companyId })
					.where(eq(usersTable.id, user.id));

				const url = request.nextUrl.clone();
				url.pathname = ROUTES.DashboardPage();
				return NextResponse.redirect(url);
			}

			return NextResponse.next();
		} catch (error) {
			console.error(error);
			return UnauthorizedResponse(request);
		}
	}
};

export const config = {
	matcher: ['/connexion/:path*', '/dashboard/:path*'],
};

/* HELPERS */

/**
 * Returns an unauthorized response.
 * User is redirected to login page and token cookie is cleared.
 */
const UnauthorizedResponse = (request: NextRequest) => {
	const url = request.nextUrl.clone();
	url.pathname = ROUTES.LoginPage();
	const response = NextResponse.redirect(url);
	return response;
};
