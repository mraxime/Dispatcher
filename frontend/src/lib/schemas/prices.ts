import { z } from 'zod';

import { createPriceConditionSchema, priceConditionRefineHandler } from './price-conditions';

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
