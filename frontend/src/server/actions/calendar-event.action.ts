'use server';

import { revalidatePath } from 'next/cache';

import type {
	CreateCalendarEventSchema,
	UpdateCalendarEventSchema,
} from 'src/lib/schemas/calendar-event.schema';
import type { CalendarEvent, CalendarEventParams } from 'src/lib/types/directus';
import { CalendarEventService } from '../services/calendar-event.service';

const calendarEventService = new CalendarEventService();

/**
 * Get many calendar-events. Can apply filters.
 */
export const getCalendarEvents = async (params?: CalendarEventParams) => {
	const result = await calendarEventService.getMany(params);
	return result;
};

/**
 * Get a single calendar-event by ID.
 */
export const getCalendarEvent = async (id: string, params?: CalendarEventParams) => {
	const result = await calendarEventService.getOne(id, params);
	return result as CalendarEvent;
};

/**
 * Create a calendar-event.
 */
export const createCalendarEvent = async (payload: CreateCalendarEventSchema) => {
	const result = await calendarEventService.create(payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a calendar-event by ID.
 */
export const updateCalendarEvent = async (id: string, payload: UpdateCalendarEventSchema) => {
	const result = await calendarEventService.update(id, payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a calendar-event by ID.
 */
export const deleteCalendarEvent = async (id: string) => {
	await calendarEventService.delete(id);
	revalidatePath('/', 'layout');
};
