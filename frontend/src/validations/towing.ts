import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { TOWING_STATUS, TOWING_TYPES } from 'src/constants/towing';
import { towingTable } from 'src/server/database/schema';

export const createTowingSchema = createInsertSchema(towingTable);
export const updateTowingSchema = createTowingSchema.deepPartial();

export const towingParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(10),
		search: z.string().optional(),
		status: z.enum(TOWING_STATUS).default('active'),
		type: z.enum(TOWING_TYPES).optional(),
	})
	.default({});
