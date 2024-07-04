'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from 'src/server/database';
import { calendarEventTable } from 'src/server/database/schema';
import { getMyPermissionKeys } from 'src/server/services';
import type { CalendarEventInput } from 'src/types';
import {
	createCalendarEventSchema,
	updateCalendarEventSchema,
} from 'src/validations/calendar-event';

/**
 * Create a calendar-event.
 */
export const createCalendarEvent = async (payload: CalendarEventInput) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('calendar-events:create')) throw new Error('Unauthorized');

	// validations
	const result = createCalendarEventSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// create
	await db.insert(calendarEventTable).values(result.data);
	revalidatePath('/');
};

/**
 * Update a calendar-event by ID.
 */
export const updateCalendarEvent = async (id: string, payload: Partial<CalendarEventInput>) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('calendar-events:update')) throw new Error('Unauthorized');

	// validations
	const result = updateCalendarEventSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// update
	await db.update(calendarEventTable).set(result.data).where(eq(calendarEventTable.id, id));
	revalidatePath('/');
};

/**
 * Delete a calendar-event by ID.
 */
export const deleteCalendarEvent = async (id: string) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('calendar-events:delete')) throw new Error('Unauthorized');

	// delete
	await db.delete(calendarEventTable).where(eq(calendarEventTable.id, id));
	revalidatePath('/');
};
