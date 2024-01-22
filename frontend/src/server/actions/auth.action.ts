'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import type { UserLoginSubmitData } from 'src/components/users/UserLoginForm';
import { ROUTES } from 'src/lib/constants/routes';
import { loginSchema, type UpdateUserSchema } from 'src/lib/schemas/user.schema';
import type { User } from 'src/lib/types/directus';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

/**
 * Get the current login session.
 */
export const getSession = async () => {
	try {
		const result = await authService.getMe();
		return result;
	} catch {
		await authService.logout();
		redirect(ROUTES.LoginPage());
	}
};

export const updateSession = async (payload: UpdateUserSchema) => {
	const result = await authService.updateMe(payload);
	return result as unknown as User;
};

/**
 * Login with credentials.
 */
export const userLogin = async (payload: UserLoginSubmitData) => {
	const result = loginSchema.safeParse(payload);
	if (!result.success) return { success: false, error: result.error.message };

	try {
		await authService.login(result.data);
	} catch {
		await authService.logout();
		revalidatePath(ROUTES.LoginPage());
	}

	redirect(ROUTES.DashboardPage());
};

/**
 * Logout current logged in user.
 */
export const userLogout = async () => {
	await authService.logout();
	redirect(ROUTES.LoginPage());
};
