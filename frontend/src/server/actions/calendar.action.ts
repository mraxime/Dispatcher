'use server';

import { revalidatePath } from 'next/cache';

import type { CreateCalendarSchema, UpdateCalendarSchema } from 'src/lib/schemas/calendar.schema';
import type { CalendarParams } from 'src/lib/types/directus';
import { CalendarService } from '../services/calendar.service';
import { withCompanyIsolation } from './utils';

const calendarService = new CalendarService();

/**
 * Get many calendars. Can apply filters.
 */
export const getCalendars = async (params?: CalendarParams) => {
	const result = await calendarService.getMany(withCompanyIsolation(params));
	return result;
};

/**
 * Get a single calendar by ID.
 */
export const getCalendar = async (id: string, params?: CalendarParams) => {
	const result = await calendarService.getOne(id, withCompanyIsolation(params));
	return result;
};

/**
 * Create a calendar.
 */
export const createCalendar = async (payload: CreateCalendarSchema) => {
	const result = await calendarService.create(payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a calendar by ID.
 */
export const updateCalendar = async (id: string, payload: UpdateCalendarSchema) => {
	const result = await calendarService.update(id, payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a calendar by ID.
 */
export const deleteCalendar = async (id: string) => {
	await calendarService.delete(id);
	revalidatePath('/', 'layout');
};
