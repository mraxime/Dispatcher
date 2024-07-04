'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ROUTES } from 'src/constants/routes';
import { db } from 'src/server/database';
import { callTable } from 'src/server/database/schema';
import { getMyPermissionKeys, handleCallRelations } from 'src/server/services';
import type { CallInput } from 'src/types';
import { createCallSchema, updateCallSchema } from 'src/validations/call';

/**
 * Create a call.
 */
export const createCall = async (payload: CallInput) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('calls:create')) throw new Error('Unauthorized');

	// validations
	const result = createCallSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// create
	await db.transaction(async (tx) => {
		const data = await handleCallRelations(tx, result.data);
		await tx.insert(callTable).values(data);
	});

	revalidatePath('/');
	redirect(ROUTES.CallsPage());
};

/**
 * Update a call by ID.
 */
export const updateCall = async (id: string, payload: Partial<CallInput>) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('calls:update')) throw new Error('Unauthorized');

	// validations
	const result = updateCallSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// update
	await db.transaction(async (tx) => {
		const data = await handleCallRelations(tx, result.data);
		await tx.update(callTable).set(data).where(eq(callTable.id, id));
	});

	revalidatePath('/');
	redirect(ROUTES.CallsPage());
};

/**
 * Delete a call by ID.
 */
export const deleteCall = async (id: string) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('calls:delete')) throw new Error('Unauthorized');

	// delete
	await db.delete(callTable).where(eq(callTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.CallsPage());
};
