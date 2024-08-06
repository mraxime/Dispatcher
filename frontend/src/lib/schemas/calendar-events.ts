import { z } from 'zod';

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
