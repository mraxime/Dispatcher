import { z } from 'zod';

import type { TowedVehicleParams } from '../types/directus';

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

export const towedVehicleParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `TowedVehicleParams`. */
		parseSearchParams: (params: Record<string, string>): TowedVehicleParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
			};
			return result;
		},

		/** Translates `TowedVehicleParams` into a flatten URL searchParams object. */
		createSearchParams: (params: TowedVehicleParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			return result;
		},
	};
})();
