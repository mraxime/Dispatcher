import { z } from 'zod';

export const createContactSchema = z.object({
	id: z.number().optional(),
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	relation: z.string().min(1),
	phone: z.string().min(1),
	ext: z.string().nullish(),
	note: z.string().nullish(),
});

export const updateContactSchema = createContactSchema.deepPartial();

export type CreateContactSchema = z.infer<typeof createContactSchema>;
export type UpdateContactSchema = z.infer<typeof updateContactSchema>;
