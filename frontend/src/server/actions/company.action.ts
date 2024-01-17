'use server';

import { revalidatePath } from 'next/cache';
import { createItem, deleteItem, readItem, readItems, updateItem, updateUser } from '@directus/sdk';

import type { CreateCompanySchema, UpdateCompanySchema } from 'src/lib/schemas/company.schema';
import type { CompanyParams } from 'src/lib/types/directus';
import { createDirectusServerClient } from '../directus';
import { getPermissions, getRoleByName } from './user.action';

/**
 * Get many companies. Can apply filters.
 */
export const getCompanies = async (params?: CompanyParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItems('companies', params));
	return result;
};

/**
 * Get a single company by ID.
 */
export const getCompany = async (id: number, params?: CompanyParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItem('companies', id, params));
	return result;
};

/**
 * Create a company.
 */
export const createCompany = async (payload: CreateCompanySchema) => {
	const api = createDirectusServerClient();

	// New company admin handler
	const superAdminRole = await getRoleByName('Super Admin');
	const permissions = await getPermissions();
	const permissionIds = permissions.map(({ id }) => id);

	// Admin data without id means it will be created
	const hasNewAdmin = !!payload.admin && !payload.admin.id;

	// modify data to set default role and permissions on the new admin
	if (hasNewAdmin) {
		payload = {
			...payload,
			admin: {
				...payload.admin,
				role: superAdminRole?.id,
				permissions: permissionIds,
			},
		};
	}

	// Ease junction format
	if (payload.admin?.permissions) {
		const permissionsFormat = payload.admin.permissions.map((id) => ({
			custom_permissions_id: id,
		}));
		// @ts-expect-error - API permissions takes this junction format
		payload = { ...payload, admin: { ...payload.admin, permissions: permissionsFormat } };
	}

	const result = await api.request(createItem('companies', payload));

	// attach new admin to this company
	if (result.admin) {
		await api.request(updateUser(result.admin as string, { company: result.id }));
	}

	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a company by ID.
 */
export const updateCompany = async (id: number, payload: UpdateCompanySchema) => {
	const api = createDirectusServerClient();

	// New company admin handler
	const superAdminRole = await getRoleByName('Super Admin');
	const permissions = await getPermissions();
	const permissionIds = permissions.map(({ id }) => id);

	// Admin data without id means it will be created
	const hasNewAdmin = !!payload.admin && !payload.admin.id;

	// modify data to set default role and permissions on the new admin
	if (hasNewAdmin) {
		payload = {
			...payload,
			admin: {
				...payload.admin,
				role: superAdminRole?.id,
				permissions: permissionIds,
			},
		};
	}

	// Ease junction format
	if (payload.admin?.permissions) {
		const permissionsFormat = payload.admin.permissions.map((id) => ({
			custom_permissions_id: id,
		}));
		// @ts-expect-error - API permissions takes this junction format
		payload = { ...payload, admin: { ...payload.admin, permissions: permissionsFormat } };
	}

	const result = await api.request(updateItem('companies', id, payload));

	// attach new admin to this company
	if (result.admin) {
		await api.request(updateUser(result.admin as string, { company: result.id }));
	}

	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a company by ID.
 */
export const deleteCompany = async (id: number) => {
	const api = createDirectusServerClient();
	await api.request(deleteItem('companies', id));
	revalidatePath('/', 'layout');
};
