import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { priceConditionTable } from 'src/server/database/schema';
import type { createPriceConditionSchema } from 'src/validations/price-condition';

export type PriceCondition = InferSelectModel<typeof priceConditionTable>;
export type PriceConditionInput = z.infer<typeof createPriceConditionSchema>;
