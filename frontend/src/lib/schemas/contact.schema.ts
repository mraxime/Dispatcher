import { z } from 'zod';

import type { ContactParams } from '../types/directus';

export const createContactSchema = z.object({
	id: z.number().optional(),
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	relation: z.string().min(1),
	phone: z.string().min(1),
	ext: z.string().nullish(),
	note: z.string().nullish(),
});

export const updateContactSchema = createContactSchema.deepPartial();

export type CreateContactSchema = z.infer<typeof createContactSchema>;
export type UpdateContactSchema = z.infer<typeof updateContactSchema>;

export const contactParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `ContactParams`. */
		parseSearchParams: (params: Record<string, string>): ContactParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
			};
			return result;
		},

		/** Translates `ContactParams` into a flatten URL searchParams object. */
		createSearchParams: (params: ContactParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			return result;
		},
	};
})();
