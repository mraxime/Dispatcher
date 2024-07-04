import 'server-only';
import { and, desc, eq, ilike } from 'drizzle-orm';
import { db } from 'src/server/database';
import { callTable, clientTable, clientVehicleTable } from 'src/server/database/schema';
import { getMySelectedCompanyId } from 'src/server/services';
import type { CallInput, CallParams, DBTransaction, IncludeRelation } from 'src/types';
import { callParamsSchema } from 'src/validations/call';

/**
 * Get many calls. Can apply filters.
 */
export const getCalls = async <T extends IncludeRelation<'callTable'>>(
	params?: CallParams,
	relations?: T,
) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// params
	const { page, limit, search, status } = callParamsSchema.parse(params);

	// get data
	const result = await db.query.callTable.findMany({
		where: and(
			eq(callTable.companyId, selectedCompanyId),
			search ? ilike(callTable.destination, search) : undefined,
			status && status !== 'all' ? eq(callTable.status, status) : undefined,
		),
		with: relations,
		limit,
		offset: (page - 1) * limit,
		orderBy: [desc(callTable.createdAt)],
	});

	return result;
};

/**
 * Get a single call by ID.
 * @Throws error if not found.
 */
export const getCall = async <T extends IncludeRelation<'callTable'>>(
	id: string,
	relations?: T,
) => {
	const selectedCompanyId = await getMySelectedCompanyId();

	// get data
	const result = await db.query.callTable.findFirst({
		where: and(eq(callTable.id, id), eq(callTable.companyId, selectedCompanyId)),
		with: relations,
	});

	if (!result) throw new Error(`Call "${id}" not found`);
	return result;
};

/**
 * Handles Call nested relations if they are passed in the request data.
 */
export const handleCallRelations = async <T extends Partial<CallInput>>(
	tx: DBTransaction,
	validatedData: T,
) => {
	const { client, vehicle, ...data } = validatedData;

	let clientId = data.clientId!;
	let vehicleId = data.vehicleId!;

	// 1) Client relation
	//////////////////////////////////////////////////////////
	if (client) {
		// update if clientId is provided
		if (clientId) {
			const [result] = await tx
				.update(clientTable)
				.set({ ...client, companyId: data.companyId! })
				.where(eq(clientTable.id, clientId))
				.returning();
			clientId = result!.id;
		}
		// otherwise we create it
		else {
			const [result] = await tx
				.insert(clientTable)
				.values({ ...client, companyId: data.companyId! })
				.returning();
			clientId = result!.id;
		}
	}

	// 2) Vehicle relation
	//////////////////////////////////////////////////////////
	if (vehicle) {
		// update if vehicleId is provided
		if (vehicleId) {
			const [result] = await tx
				.update(clientVehicleTable)
				.set({ ...vehicle, clientId })
				.where(eq(clientVehicleTable.id, vehicleId))
				.returning();
			vehicleId = result!.id;
		}
		// otherwise we create it
		else {
			const [result] = await tx
				.insert(clientVehicleTable)
				.values({ ...vehicle, clientId })
				.returning();
			vehicleId = result!.id;
		}
	}

	return { ...data, clientId, vehicleId };
};
