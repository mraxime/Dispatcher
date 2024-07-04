import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { CLIENT_STATUS } from 'src/constants/client';
import { clientTable } from 'src/server/database/schema';

export const createClientSchema = createInsertSchema(clientTable);
export const updateClientSchema = createClientSchema.deepPartial();

export const clientParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(10),
		search: z.string().optional(),
		status: z.enum(CLIENT_STATUS).default('active'),
	})
	.default({});
