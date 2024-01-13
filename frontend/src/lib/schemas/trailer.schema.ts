import { z } from 'zod';

export const createTrailerSchema = z.object({
	id: z.number().optional(),
	company: z.number(), // company.id
	name: z.string().min(1).max(99),
	in_service: z.boolean().default(false),
	belongs_to: z.string().max(99).nullish(),
	type: z.enum(['LIGHT', 'SEMI_HEAVY', 'HEAVY']).default('SEMI_HEAVY'),
	model: z.string().max(99).nullish(),
	weight: z.number().min(0).max(999_999).nullish(),
	plate_nb: z.string().max(99).nullish(),
	serial_nb: z.string().max(99).nullish(),

	// wheels
	nb: z.number().min(0).max(99).nullish(),
	capacity_front: z.number().min(0).max(999_999).nullish(),
	capacity_back: z.number().min(0).max(999_999).nullish(),
	radius_front: z.number().min(0).max(999_999).nullish(),
	radius_back: z.number().min(0).max(999_999).nullish(),

	// measures
	plate_length: z.number().min(0).max(999_999).nullish(),
	plate_height: z.number().min(0).max(999_999).nullish(),
	total_length: z.number().min(0).max(999_999).nullish(),
	total_height: z.number().min(0).max(999_999).nullish(),
	capacity: z.number().min(0).max(999_999).nullish(),
	capacity_thaw: z.number().min(0).max(999_999).nullish(),

	// others
	brake_type: z.string().max(99).nullish(),
	container: z.boolean().default(false),
	gps: z.boolean().default(false),
	ifta: z.boolean().default(false),
	wheel_lift: z.boolean().default(false),
	note: z.string().max(99).nullish(),
});

export const updateTrailerSchema = createTrailerSchema.deepPartial();

export type CreateTrailerSchema = z.infer<typeof createTrailerSchema>;
export type UpdateTrailerSchema = z.infer<typeof updateTrailerSchema>;
