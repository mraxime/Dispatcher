import 'server-only';
import { cache } from 'react';
import { and, asc, eq, ilike } from 'drizzle-orm';
import { db } from 'src/server/database';
import { calendarTable } from 'src/server/database/schema';
import { getMySelectedCompanyId } from 'src/server/services';
import type { CalendarParams } from 'src/types';
import { calendarParamsSchema } from 'src/validations/calendar';

/**
 * Get many calendars. Can apply filters.
 */
export const getCalendars = cache(async (params?: CalendarParams) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// params
	const { page, limit, search } = calendarParamsSchema.parse(params);

	// get data
	const result = await db.query.calendarTable.findMany({
		where: and(
			eq(calendarTable.companyId, selectedCompanyId),
			search ? ilike(calendarTable.name, search) : undefined,
		),
		limit,
		offset: (page - 1) * limit,
		orderBy: asc(calendarTable.createdAt),
	});

	return result;
});

/**
 * Get a single calendar by ID.
 * @Throws error if not found.
 */
export const getCalendar = cache(async (id: string) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// get data
	const result = await db.query.calendarTable.findFirst({
		where: and(eq(calendarTable.id, id), eq(calendarTable.companyId, selectedCompanyId)),
	});

	if (!result) throw new Error(`Calendar "${id}" not found`);
	return result;
});
