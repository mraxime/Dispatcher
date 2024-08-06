'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { UserLoginSubmitData } from 'src/components/users/UserLoginForm';
import { ROUTES } from 'src/lib/constants/routes';
import { loginSchema } from 'src/lib/schemas/users';
import { createDirectusServerClient } from '../directus';
import type { ServerAction } from './types';

export const userLogin: ServerAction<UserLoginSubmitData> = async (data) => {
	const result = loginSchema.safeParse(data);
	if (!result.success) return { success: false, error: result.error.message };

	const directus = createDirectusServerClient();

	try {
		await directus.login(result.data.email, result.data.password);

		// select current company by default
		const session = await directus.getSession();
		if (session.company?.id) cookies().set('company', session.company.id);
	} catch {
		await directus.logout();
		revalidatePath(ROUTES.LoginPage());

		return { success: false, error: '' };
	}

	redirect(ROUTES.LoginPage());
};

export const userLogout = async (): Promise<never> => {
	const directus = createDirectusServerClient();
	await directus.logout();
	redirect(ROUTES.LoginPage());
};
