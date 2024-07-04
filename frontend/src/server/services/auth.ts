import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ROUTES } from 'src/constants/routes';
import { auth } from 'src/server/auth';
import { db } from 'src/server/database';
import { permissionTable, userToPermissionJunctionTable } from 'src/server/database/schema';
import { getAccessibleCompanyIds } from './company';

/**
 * Get the current user session.
 * It validates session from cookies & retrieves user data.
 */
export const getSession = cache(async () => {
	const sessionId = cookies().get(auth.sessionCookieName)?.value ?? null;
	if (!sessionId) return { user: null, session: null };
	const result = await auth.validateSession(sessionId);
	try {
		if (result.session?.fresh) {
			const sessionCookie = auth.createSessionCookie(result.session.id);
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
		if (!result.session) {
			const sessionCookie = auth.createBlankSessionCookie();
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
	} catch {
		// next.js throws when you attempt to set cookie when rendering page
	}
	return result;
});

/**
 * Get the list of permission keys from the session user.
 * @Throws redirect to login page if there's no session user found.
 */
export const getMyPermissionKeys = cache(async () => {
	// Get user
	const { user } = await getSession();
	if (!user) throw redirect(ROUTES.LoginPage());

	const result = await db.query.userToPermissionJunctionTable.findMany({
		where: eq(userToPermissionJunctionTable.userId, user.id),
		with: { permission: { columns: { key: true } } },
		columns: {},
	});

	return result.map((v) => v.permission.key);
});

/**
 * Helper to retrive the selected company ID of the session user.
 * @Throws redirect to login page if there's no session user found.
 * @Throws error if session user has not selected a company yet.
 */
export const getMySelectedCompanyId = cache(async () => {
	const { user } = await getSession();
	if (!user) throw redirect(ROUTES.LoginPage());
	if (!user.selectedCompanyId) throw new Error('Please select a company');
	return user.selectedCompanyId;
});

/**
 * Get the list of companies that can be accessed from auth user.
 */
export const getMyAccessibleCompanyIds = cache(async () => {
	const { user: me } = await getSession();
	if (!me) return [];

	const result = await getAccessibleCompanyIds(me.companyId);
	return result;
});

/**
 * Get the list of all possible permissions.
 */
export const getAllPermissions = cache(async () => {
	const result = await db.select().from(permissionTable);
	return result;
});

/**
 * Get the list of permission from a user.
 */
export const getUserPermissions = cache(async (userId: string) => {
	const result = await db.query.userToPermissionJunctionTable.findMany({
		where: eq(userToPermissionJunctionTable.userId, userId),
		with: { permission: true },
		columns: {},
	});

	return result.map((v) => v.permission);
});
