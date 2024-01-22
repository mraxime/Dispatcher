'use server';

import { revalidatePath } from 'next/cache';

import type { CreateCallSchema, UpdateCallSchema } from 'src/lib/schemas/call.schema';
import type { CallParams } from 'src/lib/types/directus';
import { CallService } from '../services/call.service';
import { withCompanyIsolation } from './utils';

const callService = new CallService();

/**
 * Get many calls. Can apply filters.
 */
export const getCalls = async (params?: CallParams) => {
	const result = await callService.getMany(withCompanyIsolation(params));
	return result;
};

/**
 * Get a single call by ID.
 */
export const getCall = async (id: number, params?: CallParams) => {
	const result = await callService.getOne(id, withCompanyIsolation(params));
	return result;
};

/**
 * Create a call.
 */
export const createCall = async (payload: CreateCallSchema) => {
	const result = await callService.create(payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a call by ID.
 */
export const updateCall = async (id: number, payload: UpdateCallSchema) => {
	const result = await callService.update(id, payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a call by ID.
 */
export const deleteCall = async (id: number) => {
	await callService.delete(id);
	revalidatePath('/', 'layout');
};
