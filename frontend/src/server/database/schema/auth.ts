import { relations } from 'drizzle-orm';
import { index, pgEnum, pgTable, primaryKey, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { MEASURE_TYPES, THEME_MODES } from 'src/constants/settings';
import { PERMISSION_KEYS, USER_ROLES, USER_STATUS } from 'src/constants/user';
import { companyTable, contactTable, driverLicenseTable, towingTable } from '.';

// Users
//////////////////////////////////////////////////////////

export const userStatusEnum = pgEnum('user_status', USER_STATUS);
export const userRoleEnum = pgEnum('user_role', USER_ROLES);
export const measureTypeEnum = pgEnum('measure_type', MEASURE_TYPES);
export const themeModeEnum = pgEnum('theme_mode', THEME_MODES);

export const userTable = pgTable(
	'users',
	{
		id: uuid('id').defaultRandom().primaryKey().notNull(),
		companyId: uuid('company_id')
			.references(() => companyTable.id, { onDelete: 'cascade' })
			.notNull(),
		status: userStatusEnum('status').default('active').notNull(),
		role: userRoleEnum('role').default('employee').notNull(),
		email: varchar('email', { length: 128 }).unique().notNull(),
		username: varchar('username', { length: 64 }).unique().notNull(),
		password: varchar('password', { length: 255 }).notNull(),
		firstName: varchar('first_name', { length: 64 }).notNull(),
		lastName: varchar('last_name', { length: 64 }).notNull(),
		birthday: timestamp('birthday', { withTimezone: true, mode: 'date' }),
		hiredAt: timestamp('hired_at', { withTimezone: true, mode: 'date' }),
		phone: varchar('phone', { length: 128 }),
		ext: varchar('ext', { length: 30 }),
		selectedCompanyId: uuid('selected_company_id').references(() => companyTable.id, {
			onDelete: 'set null',
		}),
		measureType: measureTypeEnum('measure_type').default('metric').notNull(),
		theme: themeModeEnum('theme').default('light').notNull(),
		note: varchar('note', { length: 255 }),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	},
	(table) => ({
		companyFullnameIdx: index('users_company_fullname_idx').on(
			table.companyId,
			table.firstName,
			table.lastName,
		),
	}),
);

export const userRelations = relations(userTable, ({ one, many }) => ({
	company: one(companyTable, {
		fields: [userTable.companyId],
		references: [companyTable.id],
	}),
	sessions: many(sessionTable),
	contacts: many(contactTable),
	driverLicenses: many(driverLicenseTable),
	towings: many(towingTable),
}));

// Permissions
//////////////////////////////////////////////////////////

export const permissionKeyEnum = pgEnum('permission_key', PERMISSION_KEYS);

export const permissionTable = pgTable('permissions', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	key: permissionKeyEnum('key').unique().notNull(),
	description: varchar('description', { length: 255 }),
});

// Sessions
//////////////////////////////////////////////////////////

export const sessionTable = pgTable('sessions', {
	id: varchar('id', { length: 128 }).primaryKey(),
	userId: uuid('user_id')
		.references(() => userTable.id, { onDelete: 'cascade' })
		.notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
	user: one(userTable, {
		fields: [sessionTable.userId],
		references: [userTable.id],
	}),
}));

// Users Permissions Junction
//////////////////////////////////////////////////////////

export const userToPermissionJunctionTable = pgTable(
	'user_to_permission_junctions',
	{
		userId: uuid('user_id')
			.references(() => userTable.id, { onDelete: 'cascade' })
			.notNull(),
		permissionId: uuid('permission_id')
			.references(() => permissionTable.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.permissionId] }),
	}),
);

export const userToPermissionJunctionRelations = relations(
	userToPermissionJunctionTable,
	({ one }) => ({
		user: one(userTable, {
			fields: [userToPermissionJunctionTable.userId],
			references: [userTable.id],
		}),
		permission: one(permissionTable, {
			fields: [userToPermissionJunctionTable.permissionId],
			references: [permissionTable.id],
		}),
	}),
);
