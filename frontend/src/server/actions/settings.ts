'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ROUTES } from 'src/constants/routes';
import type { MeasureType, ThemeMode } from 'src/constants/settings';
import { db } from 'src/server/database';
import { userTable } from 'src/server/database/schema';
import { getAccessibleCompanyIds, getSession } from 'src/server/services';

export const setCompany = async (id: string, pathname?: string) => {
	// validations
	const { user } = await getSession();
	if (!user) throw new Error('Unauthorized');

	if (user.selectedCompanyId === id) return;

	const authorizedCompanies = await getAccessibleCompanyIds(user.companyId);
	if (!authorizedCompanies.includes(id)) throw new Error('Unauthorized');

	// update
	await db.update(userTable).set({ selectedCompanyId: id }).where(eq(userTable.id, user.id));

	/**
	 * Little hack to adresss issues that occurs when switching companies.
	 * When user switches company on specific pages, data fetching errors may occur.
	 * Thats because the data may not be accessible under the scope of the new company.
	 */
	if (pathname) {
		for (const route of [
			ROUTES.CompaniesPage(),
			ROUTES.UsersPage(),
			ROUTES.CallsPage(),
			ROUTES.TowingsPage(),
			ROUTES.ServicesPage(),
			ROUTES.ClientsPage(),
			ROUTES.BillsPage(),
			ROUTES.PricesPage(),
		]) {
			if (pathname.startsWith(route + '/')) throw redirect(route);
		}
	}

	revalidatePath('/');
};

export const setThemeMode = async (mode: ThemeMode) => {
	// validations
	const { user } = await getSession();
	if (!user) throw new Error('Unauthorized');

	// update
	await db.update(userTable).set({ theme: mode }).where(eq(userTable.id, user.id));
	revalidatePath('/');
};

export const setMeasureType = async (measureType: MeasureType) => {
	// validations
	const { user } = await getSession();
	if (!user) throw new Error('Unauthorized');

	// update
	await db.update(userTable).set({ measureType }).where(eq(userTable.id, user.id));
	revalidatePath('/');
};
