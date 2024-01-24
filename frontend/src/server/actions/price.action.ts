'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { ROUTES } from 'src/lib/constants/routes';
import type { CreatePriceSchema, UpdatePriceSchema } from 'src/lib/schemas/price.schema';
import type { PriceParams } from 'src/lib/types/directus';
import { PriceService } from '../services/price.service';
import { withCompanyIsolation } from './utils';

const priceService = new PriceService();

/**
 * Get many prices. Can apply filters.
 */
export const getPrices = async (params?: PriceParams) => {
	const result = await priceService.getMany(withCompanyIsolation(params));
	return result;
};

/**
 * Get a single price by ID.
 */
export const getPrice = async (id: number, params?: PriceParams) => {
	const result = await priceService.getOne(id, withCompanyIsolation(params));
	return result;
};

/**
 * Create a price.
 */
export const createPrice = async (payload: CreatePriceSchema) => {
	const result = await priceService.create(payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a price by ID.
 */
export const updatePrice = async (id: number, payload: UpdatePriceSchema) => {
	const result = await priceService.update(id, payload);
	revalidatePath('/', 'layout');

	// redirect for now
	redirect(ROUTES.PricesPage());
	return result;
};

/**
 * Delete a price by ID.
 */
export const deletePrice = async (id: number) => {
	await priceService.delete(id);
	revalidatePath('/', 'layout');
};
