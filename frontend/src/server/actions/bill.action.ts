'use server';

import { revalidatePath } from 'next/cache';
import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateBillSchema, UpdateBillSchema } from 'src/lib/schemas/bill.schema';
import type { BillParams } from 'src/lib/types/directus';
import { createDirectusServerClient } from '../directus';
import { withCompanyIsolation } from './utils';

/**
 * Get many bills. Can apply filters.
 */
export const getBills = async (params?: BillParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItems('bills', withCompanyIsolation(params)));
	return result;
};

/**
 * Get a single bill by ID.
 */
export const getBill = async (id: number, params?: BillParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItem('bills', id, withCompanyIsolation(params)));
	return result;
};

/**
 * Create a bill.
 */
export const createBill = async (payload: CreateBillSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(createItem('bills', payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a bill by ID.
 */
export const updateBill = async (id: number, payload: UpdateBillSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(updateItem('bills', id, payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a bill by ID.
 */
export const deleteBill = async (id: number) => {
	const api = createDirectusServerClient();
	await api.request(deleteItem('bills', id));
	revalidatePath('/', 'layout');
};
