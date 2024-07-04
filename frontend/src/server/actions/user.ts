'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { ROUTES } from 'src/constants/routes';
import { db } from 'src/server/database';
import { userTable, userToPermissionJunctionTable } from 'src/server/database/schema';
import { getMyAccessibleCompanyIds, getMyPermissionKeys } from 'src/server/services';
import type { User, UserInput } from 'src/types';
import { createUserSchema, updateUserSchema } from 'src/validations/auth';

/**
 * Some checks on "user" write operations.
 * @Throws if a check does not pass.
 */
const _writePermissionsGuard = async (payload: Partial<UserInput>) => {
	// 1) Check if the provided companyId is accessible by the person doing the request.
	if (payload.companyId ?? payload.selectedCompanyId) {
		const accessibleCompanies = await getMyAccessibleCompanyIds();

		if (payload.companyId && !accessibleCompanies.includes(payload.companyId)) {
			throw new Error('Unauthorized');
		}
		if (payload.selectedCompanyId && !accessibleCompanies.includes(payload.selectedCompanyId)) {
			throw new Error('Unauthorized');
		}
	}
};

/**
 * Create a user.
 */
export const createUser = async (payload: UserInput) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('users:create')) throw new Error('Unauthorized');
	await _writePermissionsGuard(payload);

	// validations
	const result = createUserSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');
	if (result.data.password) result.data.password = await new Argon2id().hash(result.data.password);

	const { permissions: p, ...data } = result.data;

	// create
	const [createdUser] = (await db.insert(userTable).values(data).returning()) as [User];

	// apply permissions if provided
	if (p?.length) {
		await db
			.insert(userToPermissionJunctionTable)
			.values(p.map((id) => ({ permissionId: id, userId: createdUser.id })))
			.onConflictDoNothing();
	}

	revalidatePath('/');
	redirect(ROUTES.UsersPage());
};

/**
 * Update a user.
 */
export const updateUser = async (id: User['id'], payload: Partial<UserInput>) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('users:update')) throw new Error('Unauthorized');
	await _writePermissionsGuard(payload);

	// validations
	const result = updateUserSchema.safeParse(payload);
	if (!result.success) throw new Error('Unauthorized');
	if (result.data.password) result.data.password = await new Argon2id().hash(result.data.password);

	// update
	const [updatedUser] = (await db
		.update(userTable)
		.set(result.data)
		.where(eq(userTable.id, id))
		.returning()) as [User];

	// apply permissions if provided
	await db.transaction(async (tx) => {
		if (result.data.permissions) {
			await tx
				.delete(userToPermissionJunctionTable)
				.where(eq(userToPermissionJunctionTable.userId, updatedUser.id));
			await tx
				.insert(userToPermissionJunctionTable)
				.values(result.data.permissions.map((id) => ({ permissionId: id, userId: updatedUser.id })))
				.onConflictDoNothing();
		}
	});

	revalidatePath('/');
	redirect(ROUTES.UsersPage());
};

/**
 * Delete a user by ID.
 */
export const deleteUser = async (id: string) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('users:delete')) throw new Error('Unauthorized');

	// delete
	await db.delete(userTable).where(eq(userTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.UsersPage());
};
