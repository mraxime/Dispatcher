'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { ROUTES } from 'src/lib/constants/routes';
import type { CreateServiceSchema, UpdateServiceSchema } from 'src/lib/schemas/service.schema';
import type { ServiceParams } from 'src/lib/types/directus';
import { ServiceService } from '../services/service.service';
import { withCompanyIsolation } from './utils';

const serviceService = new ServiceService();

/**
 * Get many services. Can apply filters.
 */
export const getServices = async (params?: ServiceParams) => {
	const result = await serviceService.getMany(withCompanyIsolation(params));
	return result;
};

/**
 * Get a single service by ID.
 */
export const getService = async (id: number, params?: ServiceParams) => {
	const result = await serviceService.getOne(id, withCompanyIsolation(params));
	return result;
};

/**
 * Create a service.
 */
export const createService = async (payload: CreateServiceSchema) => {
	const result = await serviceService.create(payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a service by ID.
 */
export const updateService = async (id: number, payload: UpdateServiceSchema) => {
	const result = await serviceService.update(id, payload);
	revalidatePath('/', 'layout');

	// redirect for now
	redirect(ROUTES.ServicesPage());
	return result;
};

/**
 * Delete a service by ID.
 */
export const deleteService = async (id: number) => {
	await serviceService.delete(id);
	revalidatePath('/', 'layout');
};
