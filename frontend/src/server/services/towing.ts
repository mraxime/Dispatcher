import 'server-only';
import { cache } from 'react';
import { and, asc, eq, ilike } from 'drizzle-orm';
import { db } from 'src/server/database';
import { towingTable } from 'src/server/database/schema';
import { getMySelectedCompanyId } from 'src/server/services';
import type { TowingParams } from 'src/types';
import { towingParamsSchema } from 'src/validations/towing';

/**
 * Get many towings. Can apply filters.
 */
export const getTowings = cache(async (params?: TowingParams) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// params
	const { page, limit, search, status, type } = towingParamsSchema.parse(params);

	// get data
	const result = await db.query.towingTable.findMany({
		where: and(
			eq(towingTable.companyId, selectedCompanyId),
			search ? ilike(towingTable.name, search) : undefined,
			eq(towingTable.status, status),
			type ? eq(towingTable.type, type) : undefined,
		),
		orderBy: asc(towingTable.createdAt),
		limit,
		offset: (page - 1) * limit,
	});

	return result;
});

/**
 * Get a single towing by ID.
 * @Throws error if not found.
 */
export const getTowing = cache(async (id: string) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// get data
	const result = await db.query.towingTable.findFirst({
		where: and(eq(towingTable.id, id), eq(towingTable.companyId, selectedCompanyId)),
	});

	if (!result) throw new Error(`Towing "${id}" not found`);
	return result;
});
