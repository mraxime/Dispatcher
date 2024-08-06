import { z } from 'zod';

export const createClientSchema = z.object({
	id: z.number().optional(),
	company: z.number(), // company.id
	status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
	name: z.string().min(1),
	phone: z.string().min(1),
	email: z.string().min(1).email('Courriel invalide'),
	companyName: z.string().min(1).nullish(),
});

export const updateClientSchema = createClientSchema.deepPartial();

export type CreateClientSchema = z.infer<typeof createClientSchema>;
export type UpdateClientSchema = z.infer<typeof updateClientSchema>;
