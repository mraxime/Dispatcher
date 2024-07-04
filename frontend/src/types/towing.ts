import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { towingTable } from 'src/server/database/schema';
import type { createTowingSchema, towingParamsSchema } from 'src/validations/towing';

export type Towing = InferSelectModel<typeof towingTable>;
export type TowingInput = z.infer<typeof createTowingSchema>;
export type TowingParams = z.input<typeof towingParamsSchema>;
