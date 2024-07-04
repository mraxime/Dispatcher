import 'server-only';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ROUTES } from 'src/constants/routes';
import type { PermissionKey } from 'src/constants/user';
import { logout } from 'src/server/actions/auth';
import { db } from 'src/server/database';
import { companyTable, userTable } from 'src/server/database/schema';
import { getMyPermissionKeys, getSession } from 'src/server/services';
import type { User } from 'src/types';

/**
 * Simple guard to run on protected pages that does the following:
 *  1. If session is NOT found, redirect to login page.
 *  2. Autoselect an appropriate company if empty.
 *  3. Throw `Unauthorized` if the user lacks permission keys specified in params.
 *
 * @NOTE Instead of calling this guard on every page, we could use Next.js middleware.
 * However, we are currently limited as middleware can't run on the Node runtime.
 * See comments on file `src/.middleware.ts` for more infos.
 */
export const pageGuard = async (...keys: PermissionKey[]) => {
	// If session is NOT found, redirect to login page
	const { user } = await getSession();
	if (!user) throw await logout();

	// Autoselect an appropriate company if empty
	if (!user.selectedCompanyId) {
		await db
			.update(userTable)
			.set({ selectedCompanyId: user.companyId })
			.where(eq(userTable.id, user.id));

		revalidatePath('/', 'layout');
		throw redirect(ROUTES.DashboardPage());
	}

	// Check permission
	const permissionKeys = await getMyPermissionKeys();
	if (keys.some((key) => !permissionKeys.includes(key))) throw new Error('Unauthorized');

	const selectedCompany = (await db.query.companyTable.findFirst({
		where: eq(companyTable.id, user.selectedCompanyId),
	}))!;

	// Return useful data
	return {
		user: user as User & { selectedCompanyId: NonNullable<User['selectedCompanyId']> },
		permissionKeys,
		selectedCompany,
	};
};
