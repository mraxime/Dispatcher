import { z } from 'zod';

import type { ClientParams } from '../types/directus';

export const createClientSchema = z.object({
	id: z.number().optional(),
	company: z.number(), // company.id
	status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
	name: z.string().min(1),
	phone: z.string().min(1),
	email: z.string().min(1).email('Courriel invalide'),
	companyName: z.string().min(1).nullish(),
});

export const updateClientSchema = createClientSchema.deepPartial();

export type CreateClientSchema = z.infer<typeof createClientSchema>;
export type UpdateClientSchema = z.infer<typeof updateClientSchema>;

export const clientParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `ClientParams`. */
		parseSearchParams: (params: Record<string, string>): ClientParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
				filter: { status: { _eq: params.status as 'ACTIVE' | 'INACTIVE' } },
			};
			return result;
		},

		/** Translates `ClientParams` into a flatten URL searchParams object. */
		createSearchParams: (params: ClientParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			if (params.filter?.status?._eq !== 'ACTIVE') result.status = 'INACTIVE';
			return result;
		},
	};
})();
