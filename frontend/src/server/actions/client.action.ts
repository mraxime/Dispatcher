'use server';

import { revalidatePath } from 'next/cache';
import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateClientSchema, UpdateClientSchema } from 'src/lib/schemas/client.schema';
import type { ClientParams } from 'src/lib/types/directus';
import { createDirectusServerClient } from '../directus';
import { withCompanyIsolation } from './utils';

/**
 * Get many clients. Can apply filters.
 */
export const getClients = async (params?: ClientParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItems('clients', withCompanyIsolation(params)));
	return result;
};

/**
 * Get a single client by ID.
 */
export const getClient = async (id: number, params?: ClientParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItem('clients', id, withCompanyIsolation(params)));
	return result;
};

/**
 * Create a client.
 */
export const createClient = async (payload: CreateClientSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(createItem('clients', payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a client by ID.
 */
export const updateClient = async (id: number, payload: UpdateClientSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(updateItem('clients', id, payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a client by ID.
 */
export const deleteClient = async (id: number) => {
	const api = createDirectusServerClient();
	await api.request(deleteItem('clients', id));
	revalidatePath('/', 'layout');
};
