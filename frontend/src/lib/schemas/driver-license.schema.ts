import { z } from 'zod';

import type { DriverLicenseParams } from '../types/directus';

export const createDriverLicenseSchema = z.object({
	id: z.number().optional(),
	class: z.string().min(1),
	number: z.string().min(1),
	capacity: z.number().nullish(),
	expiration_date: z.date(),
	note: z.string().nullish(),
});

export const updateDriverLicenseSchema = createDriverLicenseSchema.deepPartial();

export type CreateDriverLicenseSchema = z.infer<typeof createDriverLicenseSchema>;
export type UpdateDriverLicenseSchema = z.infer<typeof updateDriverLicenseSchema>;

export const driverLicenseParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `DriverLicenseParams`. */
		parseSearchParams: (params: Record<string, string>): DriverLicenseParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
			};
			return result;
		},

		/** Translates `DriverLicenseParams` into a flatten URL searchParams object. */
		createSearchParams: (params: DriverLicenseParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			return result;
		},
	};
})();
