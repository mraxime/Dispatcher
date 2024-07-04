'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from 'src/server/database';
import { messageTable } from 'src/server/database/schema';
import { getMyPermissionKeys } from 'src/server/services';
import type { MessageInput } from 'src/types';
import { createMessageSchema, updateMessageSchema } from 'src/validations/message';

/**
 * Create a message.
 */
export const createMessage = async (payload: MessageInput) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('messages:create')) throw new Error('Unauthorized');

	// validations
	const result = createMessageSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// create
	await db.insert(messageTable).values(result.data);
	revalidatePath('/');
};

/**
 * Update a message by ID.
 */
export const updateMessage = async (id: string, payload: Partial<MessageInput>) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('messages:update')) throw new Error('Unauthorized');

	// validations
	const result = updateMessageSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// update
	await db.update(messageTable).set(result.data).where(eq(messageTable.id, id));
	revalidatePath('/');
};

/**
 * Delete a message by ID.
 */
export const deleteMessage = async (id: string) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('messages:delete')) throw new Error('Unauthorized');

	// delete
	await db.delete(messageTable).where(eq(messageTable.id, id));
	revalidatePath('/');
};
