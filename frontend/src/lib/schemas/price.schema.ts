import { z } from 'zod';

import type { PriceParams } from '../types/directus';
import { createPriceConditionSchema, priceConditionRefineHandler } from './price-condition.schema';

export const createPriceSchema = z.object({
	id: z.number().optional(),
	company: z.number(), // company.id
	status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
	name: z.string().min(1),
	type: z.enum(['BASE', 'PER_HOUR', 'PER_KM']).default('BASE'),
	value: z.number(),
	taxable: z.boolean().default(true),
	conditions: z
		.array(createPriceConditionSchema.innerType().omit({ price: true }))
		.superRefine(priceConditionRefineHandler)
		.default([]),
});

export const updatePriceSchema = createPriceSchema.deepPartial();

export type CreatePriceSchema = z.infer<typeof createPriceSchema>;
export type UpdatePriceSchema = z.infer<typeof updatePriceSchema>;

export const priceParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `PriceParams`. */
		parseSearchParams: (params: Record<string, string>): PriceParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
				filter: { status: { _eq: params.status as 'ACTIVE' | 'INACTIVE' } },
			};
			return result;
		},

		/** Translates `PriceParams` into a flatten URL searchParams object. */
		createSearchParams: (params: PriceParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			if (params.filter?.status?._eq !== 'ACTIVE') result.status = 'INACTIVE';
			return result;
		},
	};
})();
