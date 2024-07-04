import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { clientVehicleTable } from 'src/server/database/schema';

export const createClientVehicleSchema = createInsertSchema(clientVehicleTable);
export const updateClientVehicleSchema = createClientVehicleSchema.deepPartial();

export const clientVehicleParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(10),
		search: z.string().optional(),
	})
	.default({});
