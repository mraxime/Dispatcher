import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { priceTable } from 'src/server/database/schema';
import type { createPriceSchema, priceParamsSchema } from 'src/validations/price';

export type Price = InferSelectModel<typeof priceTable>;
export type PriceInput = z.infer<typeof createPriceSchema>;
export type PriceParams = z.input<typeof priceParamsSchema>;
