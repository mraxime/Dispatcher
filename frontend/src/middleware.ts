import { NextResponse, type NextMiddleware, type NextRequest } from 'next/server';

import { ROUTES } from 'src/lib/constants/routes';
import { CompanyService } from './server/services/company.service';

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
			await getSession(request);
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
	 *  2. Validate the selected company from cookies.
	 *  3. Autoselect an appropriate company if not valid.
	 */
	if (request.nextUrl.pathname.startsWith('/dashboard')) {
		try {
			const session = await getSession(request);
			const currentCompany = request.cookies.get('company')?.value;

			if (!currentCompany) {
				const url = request.nextUrl.clone();
				url.pathname = ROUTES.DashboardPage();
				const response = NextResponse.redirect(url);
				response.cookies.set('company', String(session.user.company));
				return response;
			}

			// get list of companies the user can access
			const companyService = new CompanyService();
			const allowedCompanies = await companyService.getSubCompaniesDeep(session.user.company);

			// validate company
			if (allowedCompanies.includes(Number(currentCompany))) {
				return NextResponse.next();
			} else {
				const response = NextResponse.next();
				response.cookies.set('company', String(session.user.company));
				return response;
			}
		} catch (error) {
			console.error(error);
			return UnauthorizedResponse(request);
		}
	}

	return NextResponse.next();
};

export const config = {
	matcher: ['/connexion/:path*', '/dashboard/:path*'],
};

/* HELPERS */

/**
 * Get the current user session.
 * It validates token from request cookies & retrieves user data.
 */
const getSession = async (request: NextRequest) => {
	const token = request.cookies.get('access_token')?.value;
	if (!token) throw new Error('No token');

	const result = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/users/me?fields=id,company`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!result.ok) throw new Error('Invalid token');
	const user = ((await result.json()) as { data: { id: string; company: number } }).data;

	return { token, user };
};

/**
 * Returns an unauthorized response.
 * User is redirected to login page and token cookie is cleared.
 */
const UnauthorizedResponse = (request: NextRequest) => {
	const url = request.nextUrl.clone();
	url.pathname = ROUTES.LoginPage();
	const response = NextResponse.redirect(url);
	response.cookies.delete('access_token');
	return response;
};
