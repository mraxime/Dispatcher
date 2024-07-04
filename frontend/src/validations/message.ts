import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { messageTable } from 'src/server/database/schema';

export const createMessageSchema = createInsertSchema(messageTable);
export const updateMessageSchema = createMessageSchema.deepPartial();

export const messageParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(100),
		search: z.string().optional(),
	})
	.default({});
