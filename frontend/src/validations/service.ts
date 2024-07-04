import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { SERVICE_STATUS } from 'src/constants/service';
import { serviceTable } from 'src/server/database/schema';

export const createServiceSchema = createInsertSchema(serviceTable);
export const updateServiceSchema = createServiceSchema.deepPartial();

export const serviceParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(10),
		search: z.string().optional(),
		status: z.enum(SERVICE_STATUS).default('active'),
	})
	.default({});
