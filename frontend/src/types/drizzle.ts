import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm';
import type { db } from 'src/server/database';
import type * as schema from 'src/server/database/schema';

/**
 * Types helpers to allow infering table model with relations
 * See: https://github.com/drizzle-team/drizzle-orm/issues/695
 */

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
	'one' | 'many',
	boolean,
	TSchema,
	TSchema[TableName]
>['with'];

export type ResultType<
	TableName extends keyof TSchema,
	With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
	TSchema,
	TSchema[TableName],
	{
		with: With;
	}
>;

export type DBTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
