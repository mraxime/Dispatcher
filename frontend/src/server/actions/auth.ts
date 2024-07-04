'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq, or } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { ROUTES } from 'src/constants/routes';
import { auth } from 'src/server/auth';
import { db } from 'src/server/database';
import { userTable } from 'src/server/database/schema';
import { getSession } from 'src/server/services';
import type { LoginInput, UserInput } from 'src/types';
import { loginSchema, updateUserSchema } from 'src/validations/auth';

/**
 * Login with credentials.
 */
export const login = async (payload: LoginInput) => {
	const result = loginSchema.safeParse(payload);
	if (!result.success) return { error: result.error.message };

	// 1) Find user
	const user = await db.query.userTable.findFirst({
		where: or(
			eq(userTable.username, result.data.username),
			eq(userTable.email, result.data.username),
		),
	});

	// TODO: we might instead wanna add throttling to prevent brute-force attacks.
	// We can also still verify the password even if the username isn't correct
	// so an attacker won't notice when a user is non-existant.
	if (!user) return { error: 'Identifiant ou mot de passe incorrect' };

	// 2) Check password
	const validPassword = await new Argon2id().verify(user.password, result.data.password);
	if (!validPassword) return { error: 'Identifiant ou mot de passe incorrect' };

	// 3) Create session
	const session = await auth.createSession(user.id, {});
	const sessionCookie = auth.createSessionCookie(session.id);

	// 4) Set cookie
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	redirect(ROUTES.DashboardPage());
};

/**
 * Logout current logged in user.
 */
export const logout = async () => {
	try {
		const { session } = await getSession();
		if (session) await auth.invalidateSession(session.id);
	} catch {}

	const sessionCookie = auth.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	redirect(ROUTES.LoginPage());
};

/**
 * Update your own profile.
 */
export const updateMe = async (payload: Partial<UserInput>) => {
	// Get user
	const { user } = await getSession();
	if (!user) throw new Error('Unauthorized');

	// Validate payload
	const result = updateUserSchema.safeParse(payload);
	if (!result.success) throw new Error('Unauthorized');
	if (result.data.password) result.data.password = await new Argon2id().hash(result.data.password);

	// Update user
	await db.update(userTable).set(result.data).where(eq(userTable.id, user.id));
	revalidatePath('/');
};
