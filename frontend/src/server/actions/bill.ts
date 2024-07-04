'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ROUTES } from 'src/constants/routes';
import { db } from 'src/server/database';
import { billTable } from 'src/server/database/schema';
import { getMyPermissionKeys } from 'src/server/services';
import type { BillInput } from 'src/types';
import { createBillSchema, updateBillSchema } from 'src/validations/bill';

/**
 * Create a bill.
 */
export const createBill = async (payload: BillInput) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('bills:create')) throw new Error('Unauthorized');

	// validations
	const result = createBillSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// create
	await db.insert(billTable).values(result.data);

	revalidatePath('/');
	redirect(ROUTES.BillsPage());
};

/**
 * Update a bill by ID.
 */
export const updateBill = async (id: string, payload: Partial<BillInput>) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('bills:update')) throw new Error('Unauthorized');

	// validations
	const result = updateBillSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// update
	await db.update(billTable).set(result.data).where(eq(billTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.BillsPage());
};

/**
 * Delete a bill by ID.
 */
export const deleteBill = async (id: string) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('bills:delete')) throw new Error('Unauthorized');

	// delete
	await db.delete(billTable).where(eq(billTable.id, id));

	revalidatePath('/');
	redirect(ROUTES.BillsPage());
};
