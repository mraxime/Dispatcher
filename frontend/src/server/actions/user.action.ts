'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
	createUser as createDirectusUser,
	deleteUser as deleteDirectusUser,
	readItems,
	readRoles,
	readUser,
	readUsers,
	updateUser as updateDirectusUser,
} from '@directus/sdk';

import type { UserLoginSubmitData } from 'src/components/users/UserLoginForm';
import { withCompanyIsolation } from 'src/hooks/utils';
import { createDirectusPublicClient } from 'src/lib/api';
import type { SUPER_USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import {
	loginSchema,
	type CreateUserSchema,
	type UpdateUserSchema,
} from 'src/lib/schemas/user.schema';
import type { User, UserParams, UserPermissionParams } from 'src/lib/types/directus';

const api = createDirectusPublicClient();

/**
 * Get many users. Can apply filters.
 */
export const getUsers = async (params?: UserParams, companyIsolation = true) => {
	const result = (await api.request(
		// @ts-expect-error - Looks fine.
		readUsers(companyIsolation ? withCompanyIsolation(params) : params),
	)) as unknown as Promise<User[]>;

	return result;
};

/**
 * Get a single user by ID.
 */
export const getUser = async (id: string, params: UserParams) => {
	// @ts-expect-error - Looks fine.
	const result = await api.request(readUser(id, params));
	return result;
};

/**
 * Create a user.
 */
export const createUser = async (payload: CreateUserSchema) => {
	if (payload.permissions) {
		payload = {
			...payload,
			// @ts-expect-error - API permissions takes this junction format
			permissions: payload.permissions.map((id) => ({ custom_permissions_id: id })),
		};
	}

	const result = await api.request(createDirectusUser(payload));
	revalidatePath('/');
	return result;
};

/**
 * Update a user.
 */
export const updateUser = async (id: string, payload: UpdateUserSchema) => {
	if (payload.permissions) {
		payload = {
			...payload,
			// @ts-expect-error - API permissions takes this junction format
			permissions: payload.permissions.map((id) => ({ custom_permissions_id: id })),
		};
	}

	const result = await api.request(updateDirectusUser(id, payload));
	revalidatePath('/');
	return result;
};

/**
 * Delete a user by ID.
 */
export const deleteUser = async (id: string) => {
	await api.request(deleteDirectusUser(id));
	revalidatePath('/');
};

export const userLogin = async (data: UserLoginSubmitData) => {
	const result = loginSchema.safeParse(data);
	if (!result.success) return { success: false, error: result.error.message };

	try {
		await api.login(result.data.email, result.data.password);

		// select current company by default
		const session = await api.getSession();
		if (session.company?.id) cookies().set('company', session.company.id);
	} catch {
		await api.logout();
		revalidatePath(ROUTES.LoginPage());

		return { success: false, error: '' };
	}

	redirect(ROUTES.LoginPage());
};

export const userLogout = async () => {
	await api.logout();
	redirect(ROUTES.LoginPage());
};

/**
 * Get list of all user permissions.
 */
export const getPermissions = async (params?: UserPermissionParams) => {
	const result = await api.request(readItems('custom_permissions', params));
	return result;
};

/**
 * Get a single user role by name.
 */
export const getRoleByName = async (name: (typeof SUPER_USER_ROLES)[number]) => {
	const result = await api.request(readRoles({ filter: { name: { _eq: name } }, limit: 1 }));
	return result[0];
};
