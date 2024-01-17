import { z } from 'zod';

import type { PriceConditionParams } from '../types/directus';

const priceConditionSchema = z.object({
	id: z.number().optional(),
	price: z.number(), // price.id
	type: z.enum(['SERVICE_DURATION', 'SERVICE_DISTANCE', 'DAY_TIME']),
	min: z.number().int().min(0).nullish(),
	max: z.number().int().min(0).nullish(),
});

export const priceConditionRefineHandler = (data, ctx) => {
	if (data.min === null && data.max === null) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: `Au moins une valeur min/max requise`,
			path: ['type'],
		});
	}

	if (data.min && data.max && data.min > data.max) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: `Doit être supérieur à la valeur min`,
			path: ['max'],
		});
	}

	if (data.type === 'DAY_TIME' && data.min > 24) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: `Maximum 24h`,
			path: ['min'],
		});
	}

	if (data.type === 'DAY_TIME' && data.max > 24) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: `Maximum 24h`,
			path: ['max'],
		});
	}
};

export const createPriceConditionSchema = priceConditionSchema.superRefine(
	priceConditionRefineHandler,
);

export const updatePriceConditionSchema = priceConditionSchema
	.deepPartial()
	.superRefine(priceConditionRefineHandler);

export type CreatePriceConditionSchema = z.infer<typeof createPriceConditionSchema>;
export type UpdatePriceConditionSchema = z.infer<typeof updatePriceConditionSchema>;

export const priceConditionParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `PriceConditionParams`. */
		parseSearchParams: (params: Record<string, string>): PriceConditionParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
			};
			return result;
		},

		/** Translates `PriceConditionParams` into a flatten URL searchParams object. */
		createSearchParams: (params: PriceConditionParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			return result;
		},
	};
})();
