import { z } from 'zod';

import type { ServiceParams } from '../types/directus';

export type NewServiceForm = z.infer<typeof createServiceSchema>;

export const createServiceSchema = z.object({
	id: z.number().optional(),
	company: z.number(), // company.id
	status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
	name: z.string().min(1),
	prices: z.array(z.number()).default([]),
});

export const updateServiceSchema = createServiceSchema.deepPartial();

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;

export const serviceParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `ServiceParams`. */
		parseSearchParams: (params: Record<string, string>): ServiceParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
				filter: { status: { _eq: params.status as 'ACTIVE' | 'INACTIVE' } },
			};
			return result;
		},

		/** Translates `ServiceParams` into a flatten URL searchParams object. */
		createSearchParams: (params: ServiceParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			if (params.filter?.status?._eq !== 'ACTIVE') result.status = 'INACTIVE';
			return result;
		},
	};
})();
