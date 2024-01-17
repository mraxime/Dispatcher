'use server';

import { revalidatePath } from 'next/cache';
import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateCallSchema, UpdateCallSchema } from 'src/lib/schemas/call.schema';
import type { CallParams } from 'src/lib/types/directus';
import { createDirectusServerClient } from '../directus';
import { withCompanyIsolation } from './utils';

/**
 * Get many calls. Can apply filters.
 */
export const getCalls = async (params?: CallParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItems('calls', withCompanyIsolation(params)));
	return result;
};

/**
 * Get a single call by ID.
 */
export const getCall = async (id: number, params?: CallParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItem('calls', id, withCompanyIsolation(params)));
	return result;
};

/**
 * Create a call.
 */
export const createCall = async (payload: CreateCallSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(createItem('calls', payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a call by ID.
 */
export const updateCall = async (id: number, payload: UpdateCallSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(updateItem('calls', id, payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a call by ID.
 */
export const deleteCall = async (id: number) => {
	const api = createDirectusServerClient();
	await api.request(deleteItem('calls', id));
	revalidatePath('/', 'layout');
};
