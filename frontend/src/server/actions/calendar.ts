'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from 'src/server/database';
import { calendarTable } from 'src/server/database/schema';
import { getMyPermissionKeys } from 'src/server/services';
import type { CalendarInput } from 'src/types';
import { createCalendarSchema, updateCalendarSchema } from 'src/validations/calendar';

/**
 * Create a calendar.
 */
export const createCalendar = async (payload: CalendarInput) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('calendars:create')) throw new Error('Unauthorized');

	// validations
	const result = createCalendarSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// create
	await db.insert(calendarTable).values(result.data);
	revalidatePath('/');
};

/**
 * Update a calendar by ID.
 */
export const updateCalendar = async (id: string, payload: Partial<CalendarInput>) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('calendars:update')) throw new Error('Unauthorized');

	// validations
	const result = updateCalendarSchema.safeParse(payload);
	if (!result.success) throw new Error('Bad format');

	// update
	await db.update(calendarTable).set(result.data).where(eq(calendarTable.id, id));
	revalidatePath('/');
};

/**
 * Delete a calendar by ID.
 */
export const deleteCalendar = async (id: string) => {
	// permissions
	const permissions = await getMyPermissionKeys();
	if (!permissions.includes('calendars:delete')) throw new Error('Unauthorized');

	// delete
	await db.delete(calendarTable).where(eq(calendarTable.id, id));
	revalidatePath('/');
};
