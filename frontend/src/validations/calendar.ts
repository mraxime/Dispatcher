import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { calendarTable } from 'src/server/database/schema';

export const createCalendarSchema = createInsertSchema(calendarTable);
export const updateCalendarSchema = createCalendarSchema.deepPartial();

export const calendarParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(10),
		search: z.string().optional(),
	})
	.default({});
