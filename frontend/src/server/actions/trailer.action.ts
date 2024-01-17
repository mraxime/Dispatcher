'use server';

import { revalidatePath } from 'next/cache';
import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateTrailerSchema, UpdateTrailerSchema } from 'src/lib/schemas/trailer.schema';
import type { TrailerParams } from 'src/lib/types/directus';
import { createDirectusServerClient } from '../directus';
import { withCompanyIsolation } from './utils';

/**
 * Get many trailers. Can apply filters.
 */
export const getTrailers = async (params?: TrailerParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItems('trailers', withCompanyIsolation(params)));
	return result;
};

/**
 * Get a single trailer by ID.
 */
export const getTrailer = async (id: number, params?: TrailerParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItem('trailers', id, withCompanyIsolation(params)));
	return result;
};

/**
 * Create a trailer.
 */
export const createTrailer = async (payload: CreateTrailerSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(createItem('trailers', payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a trailer by ID.
 */
export const updateTrailer = async (id: number, payload: UpdateTrailerSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(updateItem('trailers', id, payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a trailer by ID.
 */
export const deleteTrailer = async (id: number) => {
	const api = createDirectusServerClient();
	await api.request(deleteItem('trailers', id));
	revalidatePath('/', 'layout');
};
