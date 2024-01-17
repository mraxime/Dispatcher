'use server';

import { revalidatePath } from 'next/cache';
import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type {
	CreateCalendarEventSchema,
	UpdateCalendarEventSchema,
} from 'src/lib/schemas/calendar-event.schema';
import type { CalendarEventParams } from 'src/lib/types/directus';
import { createDirectusServerClient } from '../directus';

/**
 * Get many calendar-events. Can apply filters.
 */
export const getCalendarEvents = async (params?: CalendarEventParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItems('calendar_events', params));
	return result;
};

/**
 * Get a single calendar-event by ID.
 */
export const getCalendarEvent = async (id: string, params?: CalendarEventParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItem('calendar_events', id, params));
	return result;
};

/**
 * Create a calendar-event.
 */
export const createCalendarEvent = async (payload: CreateCalendarEventSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(createItem('calendar_events', payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a calendar-event by ID.
 */
export const updateCalendarEvent = async (id: string, payload: UpdateCalendarEventSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(updateItem('calendar_events', id, payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a calendar-event by ID.
 */
export const deleteCalendarEvent = async (id: string) => {
	const api = createDirectusServerClient();
	await api.request(deleteItem('calendar_events', id));
	revalidatePath('/', 'layout');
};
