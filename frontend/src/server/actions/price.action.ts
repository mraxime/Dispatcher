'use server';

import { revalidatePath } from 'next/cache';
import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreatePriceSchema, UpdatePriceSchema } from 'src/lib/schemas/price.schema';
import type { PriceParams } from 'src/lib/types/directus';
import { createDirectusServerClient } from '../directus';
import { withCompanyIsolation } from './utils';

/**
 * Get many prices. Can apply filters.
 */
export const getPrices = async (params?: PriceParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItems('prices', withCompanyIsolation(params)));
	return result;
};

/**
 * Get a single price by ID.
 */
export const getPrice = async (id: number, params?: PriceParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItem('prices', id, withCompanyIsolation(params)));
	return result;
};

/**
 * Create a price.
 */
export const createPrice = async (payload: CreatePriceSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(createItem('prices', payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a price by ID.
 */
export const updatePrice = async (id: number, payload: UpdatePriceSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(updateItem('prices', id, payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a price by ID.
 */
export const deletePrice = async (id: number) => {
	const api = createDirectusServerClient();
	await api.request(deleteItem('prices', id));
	revalidatePath('/', 'layout');
};
