import 'server-only';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) throw new Error('Env not declared: DATABASE_URL');
const postgresClient = postgres(process.env.DATABASE_URL);

// Fix dev server creating a new client on every reload
export const db =
	process.env.NODE_ENV === 'production'
		? drizzle(postgresClient, { schema })
		: global.db ?? drizzle(postgresClient, { schema });

if (process.env.NODE_ENV !== 'production' && !global.db) global.db = db;

declare global {
	// eslint-disable-next-line no-var
	var db: PostgresJsDatabase<typeof schema> | undefined;
}
