'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ROUTES } from 'src/constants/routes';
import { db } from 'src/server/database';
import { towingTable } from 'src/server/database/schema';
import { getMyPermissionKeys } from 'src/server/services';
import type { TowingInput } from 'src/types';
import { createTowingSchema, updateTowingSchema } from 'src/validations/towing';

/**
 * Create a towing.
 */
export const createTowing = async (payload: TowingInput) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('towings:create')) throw new Error('Unauthorized');

	// validations
	const result = createTowingSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// create
	await db.insert(towingTable).values(result.data);

	revalidatePath('/');
	redirect(ROUTES.TowingsPage());
};

/**
 * Update a towing by ID.
 */
export const updateTowing = async (id: string, payload: Partial<TowingInput>) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('towings:update')) throw new Error('Unauthorized');

	// validations
	const result = updateTowingSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// update
	await db.update(towingTable).set(result.data).where(eq(towingTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.TowingsPage());
};

/**
 * Delete a towing by ID.
 */
export const deleteTowing = async (id: string) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('towings:delete')) throw new Error('Unauthorized');

	// delete
	await db.delete(towingTable).where(eq(towingTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.TowingsPage());
};
