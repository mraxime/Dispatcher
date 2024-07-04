import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { calendarEventTable } from 'src/server/database/schema';
import type { createCalendarEventSchema } from 'src/validations/calendar-event';

export type CalendarEvent = InferSelectModel<typeof calendarEventTable>;
export type CalendarEventInput = z.infer<typeof createCalendarEventSchema>;
