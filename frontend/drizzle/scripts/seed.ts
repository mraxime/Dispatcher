/* eslint-disable unicorn/no-process-exit */
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Argon2id } from 'oslo/password';
import postgres from 'postgres';
import { PERMISSION_KEYS, type PermissionKey } from 'src/constants/user';
import * as schema from 'src/server/database/schema';
import type { Company, User } from 'src/types';

const {
	calendarTable,
	companyTable,
	permissionTable,
	userTable ,
	userToPermissionJunctionTable ,
} = schema;

if (!process.env.DATABASE_URL) throw new Error('Env not declared: DATABASE_URL');

// 1) Database connection instance
const postgresClient = postgres(process.env.DATABASE_URL);
const db = drizzle(postgresClient, { schema });

// 2) Initial root company
const initialCompany = await (async () => {
	const company = await db.query.companyTable.findFirst({
		where: eq(companyTable.name, 'root'),
	});

	if (company) {
		console.log('➖ Initial company already exist, SKIPPING...');
		return company;
	}

	const [newCompany] = (await db
		.insert(companyTable)
		.values({
			name: 'root',
			address: '950 12 avenue, Saint-Lin Laurentides Qc, Canada',
		})
		.returning()) as [Company];

	console.log(`📝 Initial company created with name: "${newCompany.name}"`);
	return newCompany;
})();

// 3) Initial admin user
const initialUser = await (async (password = 'changeme') => {
	const user = await db.query.userTable.findFirst({
		where: eq(userTable.username, 'admin'),
	});

	if (user) {
		console.log('➖ Initial user already exist, SKIPPING...');
		return user;
	}

	const hashedPassword = await new Argon2id().hash(password);
	const [newUser] = (await db
		.insert(userTable)
		.values({
			companyId: initialCompany.id,
			selectedCompanyId: initialCompany.id,
			username: 'admin',
			email: 'admin@test.com',
			password: hashedPassword,
			role: 'super_admin',
			firstName: 'Support',
			lastName: 'Progtech',
		})
		.returning()) as [User];

	console.log(`📝 Initial user created with credentials: "${newUser.username}:${password}"`);
	return newUser;
})();

// 4) Initial permssions
await (async () => {
	// get current permissions
	const currentPermissions = await db.query.permissionTable.findMany({ columns: { key: true } });
	const currentPermissionsSet = new Set<PermissionKey>();
	for (const permission of currentPermissions) currentPermissionsSet.add(permission.key);

	// get missing permissions
	const missingPermissions: { key: PermissionKey }[] = [];
	for (const key of PERMISSION_KEYS) {
		if (currentPermissionsSet.has(key)) continue;
		missingPermissions.push({ key });
	}

	if (missingPermissions.length === 0) {
		console.log('➖ No missing permission(s), SKIPPING...');
		return [];
	}

	// create missing permissions
	const result = await db.insert(permissionTable).values(missingPermissions).returning();
	console.log(`📝 Added ${missingPermissions.length} permission(s)...`);

	// add created permissions to initial user
	const arr = result.map((permission) => ({ userId: initialUser.id, permissionId: permission.id }));
	await db.insert(userToPermissionJunctionTable).values(arr);
	console.log(`📝 Initial user has now ${missingPermissions.length} more permission(s)...`);

	return result;
})();

// 5) Initial calendar
await (async () => {
	const calendar = await db.query.calendarTable.findFirst({
		where: eq(calendarTable.companyId, initialCompany.id),
	});

	if (calendar) {
		console.log('➖ Initial calendar already exists, SKIPPING...');
		return calendar;
	}

	await db.insert(calendarTable).values({
		companyId: initialCompany.id,
		name: 'Horaire',
	});

	console.log(`📝 Initial calendar created`);
})();

// 6) Complete
await postgresClient.end();
console.log('✅ Seed COMPLETED');
process.exit(0);
