'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { ROUTES } from 'src/lib/constants/routes';
import type { CreateClientSchema, UpdateClientSchema } from 'src/lib/schemas/client.schema';
import type { ClientParams } from 'src/lib/types/directus';
import { ClientService } from '../services/client.service';
import { withCompanyIsolation } from './utils';

const clientService = new ClientService();

/**
 * Get many clients. Can apply filters.
 */
export const getClients = async (params?: ClientParams) => {
	const result = await clientService.getMany(withCompanyIsolation(params));
	return result;
};

/**
 * Get a single client by ID.
 */
export const getClient = async (id: number, params?: ClientParams) => {
	const result = await clientService.getOne(id, withCompanyIsolation(params));
	return result;
};

/**
 * Create a client.
 */
export const createClient = async (payload: CreateClientSchema) => {
	const result = await clientService.create(payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a client by ID.
 */
export const updateClient = async (id: number, payload: UpdateClientSchema) => {
	const result = await clientService.update(id, payload);
	revalidatePath('/', 'layout');

	// redirect for now
	redirect(ROUTES.ClientsPage());
	return result;
};

/**
 * Delete a client by ID.
 */
export const deleteClient = async (id: number) => {
	await clientService.delete(id);
	revalidatePath('/', 'layout');
};
