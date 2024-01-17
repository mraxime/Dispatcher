import { z } from 'zod';

import type { CallParams } from '../types/directus';
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

export const callParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `CallParams`. */
		parseSearchParams: (params: Record<string, string>): CallParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
				filter: { status: { _eq: params.status as 'PENDING' /* or other */ } },
			};
			return result;
		},

		/** Translates `CallParams` into a flatten URL searchParams object. */
		createSearchParams: (params: CallParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			if (params.filter?.status?._eq !== 'PENDING')
				result.status = params.filter?.status?._eq ?? 'PENDING';
			return result;
		},
	};
})();
