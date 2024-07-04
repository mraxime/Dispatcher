import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { contactTable } from 'src/server/database/schema';

export const createContactSchema = createInsertSchema(contactTable);
export const updateContactSchema = createContactSchema.deepPartial();

export const contactParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(10),
		search: z.string().optional(),
	})
	.default({});
