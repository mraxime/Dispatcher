'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ROUTES } from 'src/constants/routes';
import { db } from 'src/server/database';
import { clientTable } from 'src/server/database/schema';
import { getMyPermissionKeys } from 'src/server/services';
import type { ClientInput } from 'src/types';
import { createClientSchema, updateClientSchema } from 'src/validations/client';

/**
 * Create a client.
 */
export const createClient = async (payload: ClientInput) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('clients:create')) throw new Error('Unauthorized');

	// validations
	const result = createClientSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// create
	await db.insert(clientTable).values(result.data);

	revalidatePath('/');
	redirect(ROUTES.ClientsPage());
};

/**
 * Update a client by ID.
 */
export const updateClient = async (id: string, payload: Partial<ClientInput>) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('clients:update')) throw new Error('Unauthorized');

	// validations
	const result = updateClientSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// update
	await db.update(clientTable).set(result.data).where(eq(clientTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.ClientsPage());
};

/**
 * Delete a client by ID.
 */
export const deleteClient = async (id: string) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('clients:delete')) throw new Error('Unauthorized');

	// delete
	await db.delete(clientTable).where(eq(clientTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.ClientsPage());
};
