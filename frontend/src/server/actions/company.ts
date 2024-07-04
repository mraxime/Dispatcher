'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ROUTES } from 'src/constants/routes';
import { db } from 'src/server/database';
import { calendarTable, companyTable } from 'src/server/database/schema';
import { getMyAccessibleCompanyIds, getMyPermissionKeys } from 'src/server/services';
import type { Company, CompanyInput } from 'src/types';
import { createCompanySchema, updateCompanySchema } from 'src/validations/company';

/**
 * Create a company.
 */
export const createCompany = async (payload: CompanyInput) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('companies:create')) throw new Error('Unauthorized');

	// validations
	const result = createCompanySchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// All companies should expect a parent company.
	// The only excepection is the root company (created on project initialization).
	if (!result.data.parentCompanyId) throw new Error('Parent company is needed');

	// permissions
	const accessibleCompanies = await getMyAccessibleCompanyIds();
	if (!accessibleCompanies.includes(result.data.parentCompanyId)) throw new Error('Unauthorized');

	// create
	const [newCompany] = (await db.insert(companyTable).values(result.data).returning()) as [Company];

	// create an initial calendar
	await db.insert(calendarTable).values({ name: 'Horaire', companyId: newCompany.id });

	revalidatePath('/');
	redirect(ROUTES.CompaniesPage());
};

/**
 * Update a company by ID.
 */
export const updateCompany = async (id: string, payload: Partial<CompanyInput>) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('companies:update')) throw new Error('Unauthorized');

	// validations
	const result = updateCompanySchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// permissions
	if (result.data.parentCompanyId) {
		const accessibleCompanies = await getMyAccessibleCompanyIds();
		if (!accessibleCompanies.includes(result.data.parentCompanyId)) throw new Error('Unauthorized');
	}

	// update
	await db.update(companyTable).set(result.data).where(eq(companyTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.CompaniesPage());
};

/**
 * Delete a company by ID.
 */
export const deleteCompany = async (id: string) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('companies:delete')) throw new Error('Unauthorized');

	const accessibleCompanies = await getMyAccessibleCompanyIds();
	if (!accessibleCompanies.includes(id)) throw new Error('Unauthorized');

	// delete
	await db.delete(companyTable).where(eq(companyTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.CompaniesPage());
};
