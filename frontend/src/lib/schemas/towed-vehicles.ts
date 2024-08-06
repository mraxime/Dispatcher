import { z } from 'zod';

export const createTowedVehicleSchema = z.object({
	id: z.number().optional(),
	model: z.string().min(1),
	license: z.string().nullish(),
	serial_number: z.string().nullish(),
	width: z.number().nullish(),
	lengthh: z.number().nullish(),
	height: z.number().nullish(),
	weight: z.number().nullish(),
});

export const updateTowedVehicleSchema = createTowedVehicleSchema.deepPartial();

export type CreateTowedVehicleSchema = z.infer<typeof createTowedVehicleSchema>;
export type UpdateTowedVehicleSchema = z.infer<typeof updateTowedVehicleSchema>;
