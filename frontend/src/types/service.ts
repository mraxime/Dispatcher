import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { serviceTable, serviceToPriceJunctionTable } from 'src/server/database/schema';
import type { createServiceSchema, serviceParamsSchema } from 'src/validations/service';

export type Service = InferSelectModel<typeof serviceTable>;
export type ServiceInput = z.infer<typeof createServiceSchema>;
export type ServiceParams = z.input<typeof serviceParamsSchema>;

export type ServicePriceJunction = InferSelectModel<typeof serviceToPriceJunctionTable>;
