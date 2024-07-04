import 'server-only';
import { cache } from 'react';
import { and, asc, eq, ilike } from 'drizzle-orm';
import { db } from 'src/server/database';
import { clientTable } from 'src/server/database/schema';
import { getMySelectedCompanyId } from 'src/server/services';
import type { ClientParams } from 'src/types';
import { clientParamsSchema } from 'src/validations/client';

/**
 * Get many clients. Can apply filters.
 */
export const getClients = cache(async (params?: ClientParams) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// params
	const { page, limit, search, status } = clientParamsSchema.parse(params);

	// get data
	const result = await db.query.clientTable.findMany({
		where: and(
			eq(clientTable.companyId, selectedCompanyId),
			search ? ilike(clientTable.firstName, search) : undefined,
			eq(clientTable.status, status),
		),
		limit,
		offset: (page - 1) * limit,
		orderBy: asc(clientTable.createdAt),
	});

	return result;
});

/**
 * Get a single client by ID.
 * @Throws error if not found.
 */
export const getClient = cache(async (id: string) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// get data
	const result = await db.query.clientTable.findFirst({
		where: and(eq(clientTable.id, id), eq(clientTable.companyId, selectedCompanyId)),
	});

	if (!result) throw new Error(`Client "${id}" not found`);
	return result;
});
