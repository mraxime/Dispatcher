import { z } from 'zod';

import type { CalendarEventParams } from '../types/directus';

export const createCalendarEventSchema = z.object({
	id: z.string().optional(),
	calendar: z.string(), // calendar.id
	title: z.string().max(255),
	description: z.string().max(5000).nullish(),
	start: z.date(),
	end: z.date(),
	allDay: z.boolean().default(true),
	color: z.enum(['info', 'success', 'warning', 'error']).default('info'),
	user_assignee: z.string().nullish(),
	trailer_assignee: z.number().nullish(),
});

export const updateCalendarEventSchema = createCalendarEventSchema.deepPartial();

export type CreateCalendarEventSchema = z.infer<typeof createCalendarEventSchema>;
export type UpdateCalendarEventSchema = z.infer<typeof updateCalendarEventSchema>;

export const calendarEventParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `CalendarEventParams`. */
		parseSearchParams: (params: Record<string, string>): CalendarEventParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
			};
			return result;
		},

		/** Translates `CalendarEventParams` into a flatten URL searchParams object. */
		createSearchParams: (params: CalendarEventParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			return result;
		},
	};
})();
