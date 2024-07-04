import 'server-only';
import { cache } from 'react';
import { and, asc, desc, eq, ilike } from 'drizzle-orm';
import { db } from 'src/server/database';
import { userTable } from 'src/server/database/schema';
import type { IncludeRelation, UserParams } from 'src/types';
import { userParamsSchema } from 'src/validations/auth';
import { getMySelectedCompanyId } from './auth';

/**
 * Get many users. Can apply filters.
 */
export const getUsers = cache(async (params?: UserParams) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// params
	const { page, limit, search, status, role } = userParamsSchema.parse(params);

	// get data
	const result = await db.query.userTable.findMany({
		where: and(
			eq(userTable.companyId, selectedCompanyId),
			search ? ilike(userTable.firstName, search) : undefined,
			status ? eq(userTable.status, status) : undefined,
			role && role !== 'all' ? eq(userTable.role, role) : undefined,
		),
		limit,
		offset: (page - 1) * limit,
		orderBy: [desc(userTable.role), asc(userTable.createdAt)],
	});

	return result;
});

/**
 * Get a single user by ID.
 * @Throws error if not found.
 */
export const getUser = cache(
	async <Relations extends IncludeRelation<'userTable'>>(
		id: string,
		// @ts-expect-error - looks fine
		// eslint-disable-next-line unicorn/no-useless-undefined
		relations: Relations = undefined,
	) => {
		const selectedCompanyId = await getMySelectedCompanyId();

		// get data
		const result = await db.query.userTable.findFirst({
			where: and(eq(userTable.id, id), eq(userTable.companyId, selectedCompanyId)),
			with: relations,
		});

		if (!result) throw new Error(`User "${id}" not found`);
		return result;
	},
);
