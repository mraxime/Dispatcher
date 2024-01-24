'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ROUTES } from 'src/lib/constants/routes';
import type { CreateCompanySchema, UpdateCompanySchema } from 'src/lib/schemas/company.schema';
import type { CompanyParams } from 'src/lib/types/directus';
import { deepMerge, isObject } from 'src/lib/utils';
import { CompanyService } from '../services/company.service';
import { getSession } from './auth.action';

const companyService = new CompanyService();

/**
 * Get many companies. Can apply filters.
 */
export const getCompanies = async (params?: CompanyParams) => {
	const accessibleCompanies = await getAuthorizedCompanies();
	params = deepMerge(params, {
		filter: { id: { _in: accessibleCompanies } },
		sort: 'date_created',
	});

	const result = await companyService.getMany(params);
	return result;
};

/**
 * Get a single company by ID.
 */
export const getCompany = async (id: number, params?: CompanyParams) => {
	const accessibleCompanies = await getAuthorizedCompanies();
	params = deepMerge(params, {
		filter: { id: { _in: accessibleCompanies } },
	} satisfies CompanyParams);

	const result = await companyService.getOne(id, params);
	return result;
};

/**
 * Create a company.
 */
export const createCompany = async (payload: CreateCompanySchema) => {
	// TODO: forms should be able to select the parent company
	const companyCookie = cookies().get('company')?.value;
	if (!companyCookie) throw new Error('Cette requête nécessite une entreprise séléctionnée');
	payload = deepMerge(payload, { parent_company: companyCookie });

	const result = await companyService.create(payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a company by ID.
 */
export const updateCompany = async (id: number, payload: UpdateCompanySchema) => {
	const result = await companyService.update(id, payload);
	revalidatePath('/', 'layout');

	// redirect for now
	redirect(ROUTES.CompaniesPage());
	return result;
};

/**
 * Delete a company by ID.
 */
export const deleteCompany = async (id: number) => {
	await companyService.delete(id);
	revalidatePath('/', 'layout');
};

/**
 * Get the list of companies that can be accessed from auth user.
 */
export const getAuthorizedCompanies = async () => {
	const me = await getSession();
	const companyId = isObject(me.company) ? me.company.id : me.company;
	const result = await companyService.getSubCompaniesDeep(companyId);
	return result;
};
