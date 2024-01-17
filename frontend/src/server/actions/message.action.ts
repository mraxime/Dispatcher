'use server';

import { revalidatePath } from 'next/cache';
import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateMessageSchema, UpdateMessageSchema } from 'src/lib/schemas/message.schema';
import type { MessageParams } from 'src/lib/types/directus';
import { createDirectusServerClient } from '../directus';
import { withCompanyIsolation } from './utils';

// TODO: add "company" relation to messages in directus

/**
 * Get many messages. Can apply filters.
 */
export const getMessages = async (params?: MessageParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItems('messages', withCompanyIsolation(params)));
	return result;
};

/**
 * Get a single message by ID.
 */
export const getMessage = async (id: number, params?: MessageParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItem('messages', id, withCompanyIsolation(params)));
	return result;
};

/**
 * Create a message.
 */
export const createMessage = async (payload: CreateMessageSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(createItem('messages', payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a message by ID.
 */
export const updateMessage = async (id: number, payload: UpdateMessageSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(updateItem('messages', id, payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a message by ID.
 */
export const deleteMessage = async (id: number) => {
	const api = createDirectusServerClient();
	await api.request(deleteItem('messages', id));
	revalidatePath('/', 'layout');
};
