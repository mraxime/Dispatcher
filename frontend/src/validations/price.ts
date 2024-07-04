import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { PRICE_STATUS, PRICE_TYPES } from 'src/constants/price';
import { priceTable } from 'src/server/database/schema';

export const createPriceSchema = createInsertSchema(priceTable);
export const updatePriceSchema = createPriceSchema.deepPartial();

export const priceParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(10),
		search: z.string().optional(),
		status: z.enum(PRICE_STATUS).default('active'),
		type: z.enum(PRICE_TYPES).optional(),
	})
	.default({});
