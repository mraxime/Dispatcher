import { z } from 'zod';

import type { BillParams } from '../types/directus';

export const createBillSchema = z.object({
	id: z.number().optional(),
	status: z.enum(['PAID', 'UNPAID']).default('UNPAID'),
	company: z.number(),
	call: z.number().nullish(),
	client: z.number(),
	price: z.number(),
	totalDistance: z.number().nullish(),
	totalHours: z.number().nullish(),
	note: z.string().nullish(),
});

export const updateBillSchema = createBillSchema.deepPartial();

export type CreateBillSchema = z.infer<typeof createBillSchema>;
export type UpdateBillSchema = z.infer<typeof updateBillSchema>;

export const billParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `BillParams`. */
		parseSearchParams: (params: Record<string, string>): BillParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
			};
			return result;
		},

		/** Translates `BillParams` into a flatten URL searchParams object. */
		createSearchParams: (params: BillParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			return result;
		},
	};
})();
