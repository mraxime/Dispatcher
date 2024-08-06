import { z } from 'zod';

import { createUserSchema } from './users';

export const createCompanySchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1),
	active: z.boolean().default(true),
	address: z.string().min(1),
	admin: createUserSchema.nullish(),
});

export const updateCompanySchema = createCompanySchema.deepPartial();

export type CreateCompanySchema = z.infer<typeof createCompanySchema>;
export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>;
