import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { billTable } from 'src/server/database/schema';
import type { billParamsSchema, createBillSchema } from 'src/validations/bill';

export type Bill = InferSelectModel<typeof billTable>;
export type BillInput = z.infer<typeof createBillSchema>;
export type BillParams = z.input<typeof billParamsSchema>;
