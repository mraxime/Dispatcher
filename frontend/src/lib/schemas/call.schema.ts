import { z } from 'zod';

import { createTowedVehicleSchema } from './towed-vehicle.schema';

export const createCallSchema = z.object({
	id: z.number().optional(),
	sort: z.number().nullish(),
	company: z.number(), // company.id
	status: z
		.enum(['IN_PROGRESS', 'PENDING', 'COMPLETED', 'CANCELED', 'IMPOUNDED', 'RESERVED'])
		.default('PENDING'),
	name: z.string().min(1),
	address: z.string().min(1),
	phone: z.string().min(1),
	destination: z.string().min(1),
	service: z.number(), // service.id
	driver: z.string().nullish(), // user.id
	driver_truck: z.number().nullish(), // trailer.id
	vehicle: createTowedVehicleSchema,
	note: z.string().nullish(),
	bill_note: z.string().nullish(),
});

export const updateCallSchema = createCallSchema.deepPartial();

export type CreateCallSchema = z.infer<typeof createCallSchema>;
export type UpdateCallSchema = z.infer<typeof updateCallSchema>;
