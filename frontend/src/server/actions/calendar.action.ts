'use server';

import { revalidatePath } from 'next/cache';
import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateCalendarSchema, UpdateCalendarSchema } from 'src/lib/schemas/calendar.schema';
import type { CalendarParams } from 'src/lib/types/directus';
import { createDirectusServerClient } from '../directus';
import { withCompanyIsolation } from './utils';

/**
 * Get many calendars. Can apply filters.
 */
export const getCalendars = async (params?: CalendarParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItems('calendars', withCompanyIsolation(params)));
	return result;
};

/**
 * Get a single calendar by ID.
 */
export const getCalendar = async (id: string, params?: CalendarParams) => {
	const api = createDirectusServerClient();
	const result = await api.request(readItem('calendars', id, withCompanyIsolation(params)));
	return result;
};

/**
 * Create a calendar.
 */
export const createCalendar = async (payload: CreateCalendarSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(createItem('calendars', payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a calendar by ID.
 */
export const updateCalendar = async (id: string, payload: UpdateCalendarSchema) => {
	const api = createDirectusServerClient();
	const result = await api.request(updateItem('calendars', id, payload));
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a calendar by ID.
 */
export const deleteCalendar = async (id: string) => {
	const api = createDirectusServerClient();
	await api.request(deleteItem('calendars', id));
	revalidatePath('/', 'layout');
};
