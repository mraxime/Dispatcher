'use server';

import { revalidatePath } from 'next/cache';

import type { CreateBillSchema, UpdateBillSchema } from 'src/lib/schemas/bill.schema';
import type { BillParams } from 'src/lib/types/directus';
import { BillService } from '../services/bill.service';
import { withCompanyIsolation } from './utils';

const billService = new BillService();

/**
 * Get many bills. Can apply filters.
 */
export const getBills = async (params?: BillParams) => {
	const result = await billService.getMany(withCompanyIsolation(params));
	return result;
};

/**
 * Get a single bill by ID.
 */
export const getBill = async (id: number, params?: BillParams) => {
	const result = await billService.getOne(id, withCompanyIsolation(params));
	return result;
};

/**
 * Create a bill.
 */
export const createBill = async (payload: CreateBillSchema) => {
	const result = await billService.create(payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a bill by ID.
 */
export const updateBill = async (id: number, payload: UpdateBillSchema) => {
	const result = await billService.update(id, payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a bill by ID.
 */
export const deleteBill = async (id: number) => {
	await billService.delete(id);
	revalidatePath('/', 'layout');
};
