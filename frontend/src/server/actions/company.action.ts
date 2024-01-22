'use server';

import { revalidatePath } from 'next/cache';

import type { CreateCompanySchema, UpdateCompanySchema } from 'src/lib/schemas/company.schema';
import type { CompanyParams } from 'src/lib/types/directus';
import { CompanyService } from '../services/company.service';

const companyService = new CompanyService();

/**
 * Get many companies. Can apply filters.
 */
export const getCompanies = async (params?: CompanyParams) => {
	const result = await companyService.getMany(params);
	return result;
};

/**
 * Get a single company by ID.
 */
export const getCompany = async (id: number, params?: CompanyParams) => {
	const result = await companyService.getOne(id, params);
	return result;
};

/**
 * Create a company.
 */
export const createCompany = async (payload: CreateCompanySchema) => {
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
	return result;
};

/**
 * Delete a company by ID.
 */
export const deleteCompany = async (id: number) => {
	await companyService.delete(id);
	revalidatePath('/', 'layout');
};
