'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ROUTES } from 'src/constants/routes';
import { db } from 'src/server/database';
import { serviceTable } from 'src/server/database/schema';
import { getMyPermissionKeys } from 'src/server/services';
import type { ServiceInput } from 'src/types';
import { createServiceSchema, updateServiceSchema } from 'src/validations/service';

/**
 * Create a service.
 */
export const createService = async (payload: ServiceInput) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('services:create')) throw new Error('Unauthorized');

	// validations
	const result = createServiceSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// create
	await db.insert(serviceTable).values(result.data);

	revalidatePath('/');
	redirect(ROUTES.ServicesPage());
};

/**
 * Update a service by ID.
 */
export const updateService = async (id: string, payload: Partial<ServiceInput>) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('services:update')) throw new Error('Unauthorized');

	// validations
	const result = updateServiceSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// update
	await db.update(serviceTable).set(result.data).where(eq(serviceTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.ServicesPage());
};

/**
 * Delete a service by ID.
 */
export const deleteService = async (id: string) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('services:delete')) throw new Error('Unauthorized');

	// delete
	await db.delete(serviceTable).where(eq(serviceTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.ServicesPage());
};
