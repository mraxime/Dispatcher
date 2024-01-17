import { z } from 'zod';

import type { CalendarParams } from '../types/directus';
import { createCalendarEventSchema } from './calendar-event.schema';

export const createCalendarSchema = z.object({
	id: z.string().optional(),
	company: z.number(), // company.id
	events: z.array(createCalendarEventSchema),
});

export const updateCalendarSchema = createCalendarSchema.deepPartial();

export type CreateCalendarSchema = z.infer<typeof createCalendarSchema>;
export type UpdateCalendarSchema = z.infer<typeof updateCalendarSchema>;

export const calendarParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `CalendarParams`. */
		parseSearchParams: (params: Record<string, string>): CalendarParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
			};
			return result;
		},

		/** Translates `CalendarParams` into a flatten URL searchParams object. */
		createSearchParams: (params: CalendarParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			return result;
		},
	};
})();
