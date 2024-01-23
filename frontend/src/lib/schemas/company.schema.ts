import { z } from 'zod';

import type { CompanyParams } from '../types/directus';
import { createUserSchema } from './user.schema';

export const createCompanySchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1),
	active: z.boolean().default(true),
	address: z.string().min(1),
	admin: createUserSchema.nullish(),
	parent_company: z.number().optional(), // company.id
	sub_companies: z.array(z.number()).default([]), // company.id
});

export const updateCompanySchema = createCompanySchema.deepPartial();

export type CreateCompanySchema = z.infer<typeof createCompanySchema>;
export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>;

export const companyParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `CompanyParams`. */
		parseSearchParams: (params: Record<string, string>): CompanyParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
				filter: { active: { _eq: params.active !== 'false' } },
			};
			return result;
		},

		/** Translates `CompanyParams` into a flatten URL searchParams object. */
		createSearchParams: (params: CompanyParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			if (params.filter?.active?._eq !== true) result.active = 'false';
			return result;
		},
	};
})();
