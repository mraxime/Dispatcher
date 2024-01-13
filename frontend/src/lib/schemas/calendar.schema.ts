import { z } from 'zod';

import { createCalendarEventSchema } from './calendar-event.schema';

export const createCalendarSchema = z.object({
	id: z.string().optional(),
	company: z.number(), // company.id
	events: z.array(createCalendarEventSchema),
});

export const updateCalendarSchema = createCalendarSchema.deepPartial();

export type CreateCalendarSchema = z.infer<typeof createCalendarSchema>;
export type UpdateCalendarSchema = z.infer<typeof updateCalendarSchema>;
