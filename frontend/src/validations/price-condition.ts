import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { priceConditionTable } from 'src/server/database/schema';

const priceConditionSchema = createInsertSchema(priceConditionTable);

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
