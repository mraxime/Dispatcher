import 'server-only';
import { cache } from 'react';
import { and, asc, eq, ilike } from 'drizzle-orm';
import { db } from 'src/server/database';
import { priceTable } from 'src/server/database/schema';
import { getMySelectedCompanyId } from 'src/server/services';
import type { PriceParams } from 'src/types';
import { priceParamsSchema } from 'src/validations/price';

/**
 * Get many prices. Can apply filters.
 */
export const getPrices = cache(async (params?: PriceParams) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// params
	const { page, limit, search, status, type } = priceParamsSchema.parse(params);

	// get data
	const result = await db.query.priceTable.findMany({
		where: and(
			eq(priceTable.companyId, selectedCompanyId),
			search ? ilike(priceTable.name, search) : undefined,
			eq(priceTable.status, status),
			type ? eq(priceTable.type, type) : undefined,
		),
		orderBy: asc(priceTable.createdAt),
		limit,
		offset: (page - 1) * limit,
	});

	return result;
});

/**
 * Get a single price by ID.
 * @Throws error if not found.
 */
export const getPrice = cache(async (id: string) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// get data
	const result = await db.query.priceTable.findFirst({
		where: and(eq(priceTable.id, id), eq(priceTable.companyId, selectedCompanyId)),
	});

	if (!result) throw new Error(`Price "${id}" not found`);
	return result;
});
