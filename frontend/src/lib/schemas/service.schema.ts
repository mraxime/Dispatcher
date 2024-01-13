import { z } from 'zod';

export type NewServiceForm = z.infer<typeof createServiceSchema>;

export const createServiceSchema = z.object({
	id: z.number().optional(),
	company: z.number(), // company.id
	status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
	name: z.string().min(1),
	prices: z.array(z.number()).default([]),
});

export const updateServiceSchema = createServiceSchema.deepPartial();

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;
