import { z } from 'zod';

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
