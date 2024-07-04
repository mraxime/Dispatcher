import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { calendarTable } from 'src/server/database/schema';
import type { calendarParamsSchema, createCalendarSchema } from 'src/validations/calendar';

export type Calendar = InferSelectModel<typeof calendarTable>;
export type CalendarInput = z.infer<typeof createCalendarSchema>;
export type CalendarParams = z.input<typeof calendarParamsSchema>;
