import 'server-only';
import { cache } from 'react';
import { and, asc, eq, ilike } from 'drizzle-orm';
import { db } from 'src/server/database';
import { billTable } from 'src/server/database/schema';
import { getMySelectedCompanyId } from 'src/server/services';
import type { BillParams } from 'src/types';
import { billParamsSchema } from 'src/validations/bill';

/**
 * Get many bills. Can apply filters.
 */
export const getBills = cache(async (params?: BillParams) => {
	const selectedCompanyId = await getMySelectedCompanyId();
	const { page, limit, search, status } = billParamsSchema.parse(params);

	const result = await db.query.billTable.findMany({
		where: and(
			eq(billTable.companyId, selectedCompanyId),
			search ? ilike(billTable.id, search) : undefined,
			eq(billTable.status, status),
		),
		limit,
		offset: (page - 1) * limit,
		orderBy: asc(billTable.createdAt),
	});

	return result;
});

/**
 * Get a single bill by ID.
 * @Throws error if not found.
 */
export const getBill = cache(async (id: string) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	const result = await db.query.billTable.findFirst({
		where: and(eq(billTable.id, id), eq(billTable.companyId, selectedCompanyId)),
	});

	if (!result) throw new Error(`Bill "${id}" not found`);
	return result;
});
