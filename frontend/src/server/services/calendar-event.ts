import 'server-only';
import { cache } from 'react';
import { asc, eq } from 'drizzle-orm';
import { db } from 'src/server/database';
import { calendarEventTable } from 'src/server/database/schema';

/**
 * Get many calendar-events. Can apply filters.
 */
export const getCalendarEvents = cache(async (calendarId: string) => {
	const result = await db.query.calendarEventTable.findMany({
		where: eq(calendarEventTable.calendarId, calendarId),
		orderBy: asc(calendarEventTable.createdAt),
		with: { userAssignee: true, towingAssignee: true },
	});

	return result;
});

/**
 * Get a single calendar-event by ID.
 * @Throws error if not found.
 */
export const getCalendarEvent = cache(async (id: string) => {
	const result = await db.query.calendarEventTable.findFirst({
		where: eq(calendarEventTable.id, id),
	});

	if (!result) throw new Error(`Calendar-event "${id}" not found`);
	return result;
});
