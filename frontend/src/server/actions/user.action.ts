'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
	createUser as createDirectusUser,
	deleteUser as deleteDirectusUser,
	readItems,
	readMe,
	readRoles,
	readUser,
	readUsers,
	updateUser as updateDirectusUser,
	updateMe,
} from '@directus/sdk';

import type { UserLoginSubmitData } from 'src/components/users/UserLoginForm';
import type { SUPER_USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import {
	loginSchema,
	type CreateUserSchema,
	type UpdateUserSchema,
} from 'src/lib/schemas/user.schema';
import type { PermissionParams, Role, RoleParams, User, UserParams } from 'src/lib/types/directus';
import { createDirectusServerClient } from '../directus';
import { withCompanyIsolation } from './utils';

/**
 * Get many users. Can apply filters.
 */
export const getUsers = async (params?: UserParams, companyIsolation = true) => {
	const api = createDirectusServerClient();
	const result = (await api.request(
		// @ts-expect-error - Looks fine.
		readUsers(companyIsolation ? withCompanyIsolation(params) : params),
	)) as unknown as Promise<User[]>;

	return result;
};

/**
 * Get a single user by ID.
 */
export const getUser = async (id: string, params?: UserParams, companyIsolation = true) => {
	const api = createDirectusServerClient();
	const result = await api.request(
		// @ts-expect-error - Looks fine.
		readUser(id, companyIsolation ? withCompanyIsolation(params) : params),
	);

	return result as unknown as User;
};

/**
 * Create a user.
 */
export const createUser = async (payload: CreateUserSchema) => {
	const api = createDirectusServerClient();
	if (payload.permissions) {
		payload = {
			...payload,
			// @ts-expect-error - API permissions takes this junction format
			permissions: payload.permissions.map((id) => ({ custom_permissions_id: id })),
		};
	}

	const result = await api.request(createDirectusUser(payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a user.
 */
export const updateUser = async (id: string, payload: UpdateUserSchema) => {
	const api = createDirectusServerClient();
	if (payload.permissions) {
		payload = {
			...payload,
			// @ts-expect-error - API permissions takes this junction format
			permissions: payload.permissions.map((id) => ({ custom_permissions_id: id })),
		};
	}

	const result = await api.request(updateDirectusUser(id, payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a user by ID.
 */
export const deleteUser = async (id: string) => {
	const api = createDirectusServerClient();
	await api.request(deleteDirectusUser(id));
	revalidatePath('/', 'layout');
};

/**
 * Get list of all user permissions.
 */
export const getPermissions = async (params?: PermissionParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItems('custom_permissions', params));
	return result;
};

/**
 * Get list of all user roles.
 */
export const getRoles = async (params?: RoleParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readRoles(params));
	return result as unknown as Role[];
};

/**
 * Get a single user role by name.
 */
export const getRoleByName = async (name: (typeof SUPER_USER_ROLES)[number]) => {
	const api = createDirectusServerClient();
	const result = await api.request(readRoles({ filter: { name: { _eq: name } }, limit: 1 }));
	return result[0];
};

/**
 * Get the current login session.
 */
export const getSession = async () => {
	const api = createDirectusServerClient();
	try {
		const me = await api.request(readMe({ fields: ['*', '*.*', '*.*.*'] }));
		return me as unknown as User;
	} catch {
		await api.logout();
		redirect(ROUTES.LoginPage());
	}
};

export const updateSession = async (payload: UpdateUserSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(updateMe(payload));
	return result as unknown as User;
};

/**
 * Login with credentials.
 */
export const userLogin = async (data: UserLoginSubmitData) => {
	const api = createDirectusServerClient();
	const result = loginSchema.safeParse(data);
	if (!result.success) return { success: false, error: result.error.message };

	try {
		await api.login(result.data.email, result.data.password);

		// select current company by default
		const session = await getSession();
		if (session.company?.id) cookies().set('company', session.company.id);
	} catch {
		await api.logout();
		revalidatePath(ROUTES.LoginPage());
	}

	redirect(ROUTES.DashboardPage());
};

/**
 * Logout current logged in user.
 */
export const userLogout = async () => {
	const api = createDirectusServerClient();
	await api.logout();
	redirect(ROUTES.LoginPage());
};
