'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ROUTES } from 'src/constants/routes';
import { db } from 'src/server/database';
import { priceTable } from 'src/server/database/schema';
import { getMyPermissionKeys } from 'src/server/services';
import type { PriceInput } from 'src/types';
import { createPriceSchema, updatePriceSchema } from 'src/validations/price';

/**
 * Create a price.
 */
export const createPrice = async (payload: PriceInput) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('prices:create')) throw new Error('Unauthorized');

	// validations
	const result = createPriceSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// create
	await db.insert(priceTable).values(result.data);

	revalidatePath('/');
	redirect(ROUTES.PricesPage());
};

/**
 * Update a price by ID.
 */
export const updatePrice = async (id: string, payload: Partial<PriceInput>) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('prices:update')) throw new Error('Unauthorized');

	// validations
	const result = updatePriceSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// update
	await db.update(priceTable).set(result.data).where(eq(priceTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.PricesPage());
};

/**
 * Delete a price by ID.
 */
export const deletePrice = async (id: string) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('prices:delete')) throw new Error('Unauthorized');

	// delete
	await db.delete(priceTable).where(eq(priceTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.PricesPage());
};
