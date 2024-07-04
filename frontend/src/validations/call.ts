import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { CALL_STATUS } from 'src/constants/call';
import { callTable } from 'src/server/database/schema';
import { createClientSchema } from './client';
import { createClientVehicleSchema } from './client-vehicle';

export const createCallSchema = createInsertSchema(callTable, {
	clientId: (schema) => schema.clientId.nullish(),
	vehicleId: (schema) => schema.vehicleId.nullish(),
})
	.extend({
		client: createClientSchema.omit({ companyId: true }).nullish(),
		vehicle: createClientVehicleSchema.omit({ clientId: true }).nullish(),
	})
	.superRefine((data, ctx) => {
		if (!data.clientId && !data.client) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Client requis',
				path: ['clientId'],
			});
		}
		if (!data.vehicleId && !data.vehicle) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Vehicule requis',
				path: ['vehicleId'],
			});
		}
	});

export const updateCallSchema = createCallSchema.innerType().partial();

export const callParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(10),
		search: z.string().optional(),
		status: z.enum(['all', ...CALL_STATUS]).default('all'),
	})
	.default({});
