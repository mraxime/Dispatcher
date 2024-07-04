import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { clientVehicleTable } from 'src/server/database/schema';
import type {
	clientVehicleParamsSchema,
	createClientVehicleSchema,
} from 'src/validations/client-vehicle';

export type ClientVehicle = InferSelectModel<typeof clientVehicleTable>;
export type ClientVehicleInput = z.infer<typeof createClientVehicleSchema>;
export type ClientVehicleParams = z.input<typeof clientVehicleParamsSchema>;
