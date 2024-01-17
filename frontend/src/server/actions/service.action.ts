'use server';

import { revalidatePath } from 'next/cache';
import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateServiceSchema, UpdateServiceSchema } from 'src/lib/schemas/service.schema';
import type { ServiceParams } from 'src/lib/types/directus';
import { createDirectusServerClient } from '../directus';
import { withCompanyIsolation } from './utils';

/**
 * Get many services. Can apply filters.
 */
export const getServices = async (params?: ServiceParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItems('services', withCompanyIsolation(params)));
	return result;
};

/**
 * Get a single service by ID.
 */
export const getService = async (id: number, params?: ServiceParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItem('services', id, withCompanyIsolation(params)));
	return result;
};

/**
 * Create a service.
 */
export const createService = async (payload: CreateServiceSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(createItem('services', payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a service by ID.
 */
export const updateService = async (id: number, payload: UpdateServiceSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(updateItem('services', id, payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a service by ID.
 */
export const deleteService = async (id: number) => {
	const api = createDirectusServerClient();
	await api.request(deleteItem('services', id));
	revalidatePath('/', 'layout');
};
