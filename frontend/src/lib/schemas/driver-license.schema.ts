import { z } from 'zod';

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
