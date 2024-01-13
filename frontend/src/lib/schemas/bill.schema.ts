import { z } from 'zod';

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
