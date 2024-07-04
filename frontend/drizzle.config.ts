import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('Env not declared: DATABASE_URL');

export default defineConfig({
	schema: './src/server/database/schema',
	out: './drizzle',
	dialect: 'postgresql',
	verbose: true,
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
