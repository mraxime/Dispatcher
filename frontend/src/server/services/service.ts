import 'server-only';
import { cache } from 'react';
import { and, asc, eq, ilike } from 'drizzle-orm';
import { db } from 'src/server/database';
import { serviceTable } from 'src/server/database/schema';
import { getMySelectedCompanyId } from 'src/server/services';
import type { ServiceParams } from 'src/types';
import { serviceParamsSchema } from 'src/validations/service';

/**
 * Get many services. Can apply filters.
 */
export const getServices = cache(async (params?: ServiceParams) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// params
	const { page, limit, search, status } = serviceParamsSchema.parse(params);

	// get data
	const result = await db.query.serviceTable.findMany({
		where: and(
			eq(serviceTable.companyId, selectedCompanyId),
			search ? ilike(serviceTable.name, search) : undefined,
			eq(serviceTable.status, status),
		),
		orderBy: asc(serviceTable.createdAt),
		limit,
		offset: (page - 1) * limit,
	});

	return result;
});

/**
 * Get a single service by ID.
 * @Throws error if not found.
 */
export const getService = cache(async (id: string) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// get data
	const result = await db.query.serviceTable.findFirst({
		where: and(eq(serviceTable.id, id), eq(serviceTable.companyId, selectedCompanyId)),
	});

	if (!result) throw new Error(`Service "${id}" not found`);
	return result;
});
