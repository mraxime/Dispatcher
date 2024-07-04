import 'server-only';
import { cache } from 'react';
import { and, asc, eq, ilike } from 'drizzle-orm';
import { db } from 'src/server/database';
import { messageTable } from 'src/server/database/schema';
import { getMySelectedCompanyId } from 'src/server/services';
import type { MessageParams } from 'src/types';
import { messageParamsSchema } from 'src/validations/message';

/**
 * Get many messages. Can apply filters.
 */
export const getMessages = cache(async (params?: MessageParams) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// params
	const { page, limit, search } = messageParamsSchema.parse(params);

	// get data
	const result = await db.query.messageTable.findMany({
		where: and(
			eq(messageTable.companyId, selectedCompanyId),
			search ? ilike(messageTable.id, search) : undefined,
		),
		orderBy: asc(messageTable.createdAt),
		limit,
		offset: (page - 1) * limit,
	});
	return result;
});

/**
 * Get a single message by ID.
 */
export const getMessage = cache(async (id: string) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// get data
	const result = await db.query.messageTable.findFirst({
		where: and(eq(messageTable.id, id), eq(messageTable.companyId, selectedCompanyId)),
	});

	return result;
});
