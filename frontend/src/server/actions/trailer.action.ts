'use server';

import { revalidatePath } from 'next/cache';

import type { CreateTrailerSchema, UpdateTrailerSchema } from 'src/lib/schemas/trailer.schema';
import type { TrailerParams } from 'src/lib/types/directus';
import { TrailerService } from '../services/trailer.service';
import { withCompanyIsolation } from './utils';

const trailerService = new TrailerService();

/**
 * Get many trailers. Can apply filters.
 */
export const getTrailers = async (params?: TrailerParams) => {
	const result = await trailerService.getMany(withCompanyIsolation(params));
	return result;
};

/**
 * Get a single trailer by ID.
 */
export const getTrailer = async (id: number, params?: TrailerParams) => {
	const result = await trailerService.getOne(id, withCompanyIsolation(params));
	return result;
};

/**
 * Create a trailer.
 */
export const createTrailer = async (payload: CreateTrailerSchema) => {
	const result = await trailerService.create(payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a trailer by ID.
 */
export const updateTrailer = async (id: number, payload: UpdateTrailerSchema) => {
	const result = await trailerService.update(id, payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a trailer by ID.
 */
export const deleteTrailer = async (id: number) => {
	await trailerService.delete(id);
	revalidatePath('/', 'layout');
};
