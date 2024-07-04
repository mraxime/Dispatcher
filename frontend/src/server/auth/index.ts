import 'server-only';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import { db } from 'src/server/database';
import { sessionTable, userTable } from 'src/server/database/schema';
import type { Session, User } from 'src/types';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const auth = new Lucia(adapter, {
	sessionCookie: {
		// this sets cookies with super long expiration
		// since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
		expires: false,
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === 'production',
		},
	},
	getUserAttributes: (attributes) => ({
		...attributes,
	}),
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: User;
		DatabaseSessionAttributes: Session;
	}
}
