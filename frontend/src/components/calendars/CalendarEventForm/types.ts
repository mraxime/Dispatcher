import type { z } from 'zod';

import type { createCalendarEventSchema } from 'src/lib/schemas/calendar-event.schema';

export type CalendarEventSubmitData = z.infer<typeof createCalendarEventSchema>;
