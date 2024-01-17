import { z } from 'zod';

import type { RoleParams } from '../types/directus';

export const createRoleSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
});

export const updateRoleSchema = createRoleSchema.deepPartial();

export type CreateRoleSchema = z.infer<typeof createRoleSchema>;
export type UpdateRoleSchema = z.infer<typeof updateRoleSchema>;

export const roleParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `UserRoleParams`. */
		parseSearchParams: (params: Record<string, string>): RoleParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
			};
			return result;
		},

		/** Translates `UserRoleParams` into a flatten URL searchParams object. */
		createSearchParams: (params: RoleParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			return result;
		},
	};
})();
