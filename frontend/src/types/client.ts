import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { clientTable } from 'src/server/database/schema';
import type { clientParamsSchema, createClientSchema } from 'src/validations/client';

export type Client = InferSelectModel<typeof clientTable>;
export type ClientInput = z.infer<typeof createClientSchema>;
export type ClientParams = z.input<typeof clientParamsSchema>;
