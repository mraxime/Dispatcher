import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { BILL_STATUS } from 'src/constants/bill';
import { billTable } from 'src/server/database/schema';

export const createBillSchema = createInsertSchema(billTable);
export const updateBillSchema = createBillSchema.deepPartial();

export const billParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(10),
		search: z.string().optional(),
		status: z.enum(BILL_STATUS).default('pending'),
	})
	.default({});
