'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readItems, readRoles } from '@directus/sdk';

import type { UserLoginSubmitData } from 'src/components/users/UserLoginForm';
import { createDirectusPublicClient } from 'src/lib/api';
import type { SUPER_USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import { loginSchema } from 'src/lib/schemas/user.schema';
import type { UserPermissionParams } from 'src/lib/types/directus';
import type { ServerAction } from './types';

const api = createDirectusPublicClient();

export const userLogin: ServerAction<UserLoginSubmitData> = async (data) => {
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

export const userLogout = async (): Promise<never> => {
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
