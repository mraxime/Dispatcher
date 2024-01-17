import { z } from 'zod';

import type { PermissionParams } from '../types/directus';

export const createPermissionSchema = z.object({
	id: z.number().optional(),
	action: z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE']),
	group: z.enum([
		'USER',
		'BILL',
		'CALENDAR',
		'CALL',
		'CLIENT',
		'COMPANY',
		'PRICE',
		'SERVICE',
		'TRAILER',
	]),
	description: z.string().nullish(),
});

export const updatePermissionSchema = createPermissionSchema.deepPartial();

export type CreatePermissionSchema = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionSchema = z.infer<typeof updatePermissionSchema>;

export const permissionParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `UserPermissionParams`. */
		parseSearchParams: (params: Record<string, string>): PermissionParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
			};
			return result;
		},

		/** Translates `UserPermissionParams` into a flatten URL searchParams object. */
		createSearchParams: (params: PermissionParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			return result;
		},
	};
})();
