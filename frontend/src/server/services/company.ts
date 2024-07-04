import 'server-only';
import { cache } from 'react';
import { and, asc, eq, ilike, inArray, or } from 'drizzle-orm';
import { db } from 'src/server/database';
import { companyTable } from 'src/server/database/schema';
import { getMyAccessibleCompanyIds } from 'src/server/services';
import type { Company, CompanyParams } from 'src/types';
import { companyParamsSchema } from 'src/validations/company';

/**
 * Get many companies. Can apply filters.
 */
export const getCompanies = cache(async (params?: CompanyParams) => {
	const accessibleCompanies = await getMyAccessibleCompanyIds();

	// params
	const { page, limit, search, status } = companyParamsSchema.parse(params);

	// get data
	const result = await db.query.companyTable.findMany({
		where: and(
			inArray(companyTable.id, accessibleCompanies),
			search
				? or(ilike(companyTable.name, `%${search}%`), ilike(companyTable.address, `%${search}%`))
				: undefined,
			eq(companyTable.status, status),
		),
		limit,
		offset: (page - 1) * limit,
		orderBy: asc(companyTable.createdAt),
	});

	return result;
});

/**
 * Get a single company by ID.
 * @Throws error if not found.
 */
export const getCompany = cache(async (id: string) => {
	const accessibleCompanies = await getMyAccessibleCompanyIds();

	// get data
	const result = await db.query.companyTable.findFirst({
		where: and(eq(companyTable.id, id), inArray(companyTable.id, accessibleCompanies)),
	});

	if (!result) throw new Error(`Company "${id}" not found`);
	return result;
});

/**
 * Finds and deeply joins sub-companies of a company to a data set.
 */
const _appendSubcompanies = async (id: string, set: Set<string>) => {
	const subCompanies = await db.query.companyTable.findMany({
		where: eq(companyTable.parentCompanyId, id),
		columns: { id: true },
	});

	// TODO: promise.all instead?
	for (const subCompany of subCompanies) {
		set.add(subCompany.id);
		await _appendSubcompanies(subCompany.id, set);
	}
};

/**
 * Returns every companies a specifc company has access to.
 */
export const getAccessibleCompanyIds = cache(async (id: string) => {
	const result = new Set<Company['id']>();
	await _appendSubcompanies(id, result);
	return [id, ...result];
});

/**
 * Get the tree of a company by it's ID
 * TODO: take a loot at https://github.com/drizzle-team/drizzle-orm/pull/1405
 * for better implementation later.
 */
export const getCompanyTree = cache(async (id: string) => {
	const result = await db.query.companyTable.findFirst({
		where: eq(companyTable.id, id),
		// Tree with max 4 level of nesting.
		with: {
			subCompanies: {
				with: {
					subCompanies: {
						with: { subCompanies: { with: { subCompanies: true } } },
					},
				},
			},
		},
	});

	return result;
});
