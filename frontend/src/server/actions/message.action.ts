'use server';

import { revalidatePath } from 'next/cache';

import type { CreateMessageSchema, UpdateMessageSchema } from 'src/lib/schemas/message.schema';
import type { MessageParams } from 'src/lib/types/directus';
import { MessageService } from '../services/message.service';
import { withCompanyIsolation } from './utils';

const messageService = new MessageService();

/**
 * Get many messages. Can apply filters.
 */
export const getMessages = async (params?: MessageParams) => {
	const result = await messageService.getMany(withCompanyIsolation(params));
	return result;
};

/**
 * Get a single message by ID.
 */
export const getMessage = async (id: number, params?: MessageParams) => {
	const result = await messageService.getOne(id, withCompanyIsolation(params));
	return result;
};

/**
 * Create a message.
 */
export const createMessage = async (payload: CreateMessageSchema) => {
	const result = await messageService.create(payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a message by ID.
 */
export const updateMessage = async (id: number, payload: UpdateMessageSchema) => {
	const result = await messageService.update(id, payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a message by ID.
 */
export const deleteMessage = async (id: number) => {
	await messageService.delete(id);
	revalidatePath('/', 'layout');
};
