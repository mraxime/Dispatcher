import { relations } from 'drizzle-orm';
import {
	boolean,
	decimal,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
	type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { BILL_STATUS } from 'src/constants/bill';
import { CALL_STATUS } from 'src/constants/call';
import { CLIENT_STATUS } from 'src/constants/client';
import { COMPANY_STATUS } from 'src/constants/company';
import { PRICE_STATUS, PRICE_TYPES } from 'src/constants/price';
import { PRICE_CONDITION_TYPES } from 'src/constants/price-condition';
import { SERVICE_STATUS } from 'src/constants/service';
import { TOWING_STATUS, TOWING_TYPES } from 'src/constants/towing';
import { userTable } from './auth';

export * from './auth';

/*
 * Drizzle is a Typescript ORM that establishes a connection with the database.
 * If you make any changes to a schema, apply them using the following commands:
 *  1. `pnpm db:generate`
 *  2. `pnpm db:migrate`
 */

// Bills
//////////////////////////////////////////////////////////

export const billStatusEnum = pgEnum('bill_status', BILL_STATUS);

// TODO: references should not delete(cascade) or change created bills.
// Will need to find a way to freeze the bills upon creation.
export const billTable = pgTable('bills', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	companyId: uuid('company_id')
		.references(() => companyTable.id, { onDelete: 'cascade' })
		.notNull(),
	status: billStatusEnum('status').default('pending').notNull(),
	callId: uuid('call_id')
		.references(() => callTable.id, { onDelete: 'cascade' })
		.notNull(),
	clientId: uuid('client_id')
		.references(() => clientTable.id, { onDelete: 'cascade' })
		.notNull(),
	priceId: uuid('price_id')
		.references(() => priceTable.id, { onDelete: 'cascade' })
		.notNull(),
	totalHours: decimal('total_hours', { precision: 10, scale: 2 }).notNull(),
	totalDistance: decimal('total_distance', { precision: 10, scale: 2 }).notNull(),
	note: varchar('note', { length: 255 }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const billRelations = relations(billTable, ({ one }) => ({
	company: one(companyTable, {
		fields: [billTable.companyId],
		references: [companyTable.id],
	}),
	call: one(callTable, {
		fields: [billTable.callId],
		references: [callTable.id],
	}),
	client: one(clientTable, {
		fields: [billTable.clientId],
		references: [clientTable.id],
	}),
	price: one(priceTable, {
		fields: [billTable.priceId],
		references: [priceTable.id],
	}),
}));

// Calendars
//////////////////////////////////////////////////////////

export const calendarTable = pgTable(
	'calendars',
	{
		id: uuid('id').primaryKey().defaultRandom().notNull(),
		companyId: uuid('company_id')
			.references(() => companyTable.id, { onDelete: 'cascade' })
			.notNull(),
		name: varchar('name', { length: 64 }).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	},
	(table) => ({
		companyNameIdx: uniqueIndex('calendars_company_name_idx').on(table.companyId, table.name),
	}),
);

export const calendarRelations = relations(calendarTable, ({ one, many }) => ({
	company: one(companyTable, {
		fields: [calendarTable.companyId],
		references: [companyTable.id],
	}),
	events: many(calendarEventTable),
}));

// Calendar Events
//////////////////////////////////////////////////////////

export const calendarEventTable = pgTable('calendar_events', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	title: varchar('title', { length: 64 }).notNull(),
	description: varchar('description', { length: 255 }),
	start: timestamp('start', { withTimezone: true, mode: 'date' }).notNull(),
	end: timestamp('end', { withTimezone: true, mode: 'date' }).notNull(),
	allDay: boolean('all_day').default(false).notNull(),
	color: varchar('color', { length: 30 }).notNull(),
	calendarId: uuid('calendar_id')
		.references(() => calendarTable.id, { onDelete: 'cascade' })
		.notNull(),
	userAssigneeId: uuid('user_assignee_id').references(() => userTable.id, {
		onDelete: 'set null',
	}),
	towingAssigneeId: uuid('towing_assignee_id').references(() => towingTable.id, {
		onDelete: 'set null',
	}),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const calendarEventRelations = relations(calendarEventTable, ({ one }) => ({
	calendar: one(calendarTable, {
		fields: [calendarEventTable.calendarId],
		references: [calendarTable.id],
	}),
	userAssignee: one(userTable, {
		fields: [calendarEventTable.userAssigneeId],
		references: [userTable.id],
	}),
	towingAssignee: one(towingTable, {
		fields: [calendarEventTable.towingAssigneeId],
		references: [towingTable.id],
	}),
}));

// Calls
//////////////////////////////////////////////////////////

export const callStatusEnum = pgEnum('call_status', CALL_STATUS);

// TODO: references should not delete(cascade) or change created calls.
// Will need to find a way to freeze the calls upon creation.
export const callTable = pgTable('calls', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	companyId: uuid('company_id')
		.references(() => companyTable.id, { onDelete: 'cascade' })
		.notNull(),
	status: callStatusEnum('status').default('pending').notNull(),
	origin: varchar('origin', { length: 128 }).notNull(),
	checkpoint: varchar('checkpoint', { length: 128 }).notNull(),
	destination: varchar('destination', { length: 128 }).notNull(),
	serviceId: uuid('service_id')
		.references(() => serviceTable.id, { onDelete: 'cascade' })
		.notNull(),
	clientId: uuid('client_id')
		.references(() => clientTable.id, { onDelete: 'cascade' })
		.notNull(),
	vehicleId: uuid('vehicle_id')
		.references(() => clientVehicleTable.id, { onDelete: 'cascade' })
		.notNull(),
	towingId: uuid('towing_id').references(() => towingTable.id, { onDelete: 'set null' }),
	driverId: uuid('driver_id').references(() => userTable.id, { onDelete: 'set null' }),
	note: varchar('note', { length: 255 }),
	billNote: varchar('bill_note', { length: 255 }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const callRelations = relations(callTable, ({ one, many }) => ({
	company: one(companyTable, {
		fields: [callTable.companyId],
		references: [companyTable.id],
	}),
	service: one(serviceTable, {
		fields: [callTable.serviceId],
		references: [serviceTable.id],
	}),
	client: one(clientTable, {
		fields: [callTable.clientId],
		references: [clientTable.id],
	}),
	vehicle: one(clientVehicleTable, {
		fields: [callTable.vehicleId],
		references: [clientVehicleTable.id],
	}),
	towing: one(towingTable, {
		fields: [callTable.towingId],
		references: [towingTable.id],
	}),
	driver: one(userTable, {
		fields: [callTable.driverId],
		references: [userTable.id],
	}),
	bills: many(billTable),
}));

// Contacts
//////////////////////////////////////////////////////////

export const contactTable = pgTable('contacts', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	userId: uuid('user_id')
		.references(() => userTable.id, { onDelete: 'cascade' })
		.notNull(),
	firstName: varchar('first_name', { length: 64 }).notNull(),
	lastName: varchar('last_name', { length: 64 }).notNull(),
	email: varchar('email', { length: 64 }),
	phone: varchar('phone', { length: 64 }).notNull(),
	ext: varchar('ext', { length: 30 }),
	relation: varchar('relation', { length: 30 }).notNull(),
	note: varchar('note', { length: 255 }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const contactRelations = relations(contactTable, ({ one }) => ({
	user: one(userTable, {
		fields: [contactTable.userId],
		references: [userTable.id],
	}),
}));

// Clients
//////////////////////////////////////////////////////////

export const clientStatusEnum = pgEnum('client_status', CLIENT_STATUS);

export const clientTable = pgTable(
	'clients',
	{
		id: uuid('id').primaryKey().defaultRandom().notNull(),
		companyId: uuid('company_id')
			.references(() => companyTable.id, { onDelete: 'cascade' })
			.notNull(),
		status: clientStatusEnum('status').default('active').notNull(),
		firstName: varchar('first_name', { length: 64 }).notNull(),
		lastName: varchar('last_name', { length: 64 }),
		email: varchar('email', { length: 64 }),
		phone: varchar('phone', { length: 64 }),
		companyName: varchar('company_name', { length: 64 }),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	},
	(table) => ({
		companyEmailIdx: uniqueIndex('clients_company_email_idx').on(table.companyId, table.email),
		companyFullnameIdx: index('clients_company_fullname_idx').on(
			table.companyId,
			table.firstName,
			table.lastName,
		),
	}),
);

export const clientRelations = relations(clientTable, ({ one, many }) => ({
	company: one(companyTable, {
		fields: [clientTable.companyId],
		references: [companyTable.id],
	}),
	bills: many(billTable),
	vehicles: many(clientVehicleTable),
}));

// Client Vehicles
//////////////////////////////////////////////////////////

export const clientVehicleTable = pgTable('client_vehicles', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	clientId: uuid('client_id')
		.references(() => clientTable.id, { onDelete: 'cascade' })
		.notNull(),
	license: varchar('license', { length: 128 }),
	model: varchar('model', { length: 128 }).notNull(),
	serialNb: varchar('serial_number', { length: 128 }),
	height: decimal('height', { precision: 10, scale: 2 }),
	length: decimal('length', { precision: 10, scale: 2 }),
	weight: decimal('weight', { precision: 10, scale: 2 }),
	width: decimal('width', { precision: 10, scale: 2 }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const clientVehicleRelations = relations(clientVehicleTable, ({ one }) => ({
	client: one(clientTable, {
		fields: [clientVehicleTable.clientId],
		references: [clientTable.id],
	}),
}));

// Companies
//////////////////////////////////////////////////////////

export const companyStatusEnum = pgEnum('company_status', COMPANY_STATUS);

export const companyTable = pgTable('companies', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	parentCompanyId: uuid('parent_company_id').references((): AnyPgColumn => companyTable.id, {
		onDelete: 'restrict',
	}),
	name: varchar('name', { length: 64 }).unique().notNull(),
	status: companyStatusEnum('status').default('active').notNull(),
	address: varchar('address', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const companyRelations = relations(companyTable, ({ one, many }) => ({
	parentCompany: one(companyTable, {
		fields: [companyTable.parentCompanyId],
		references: [companyTable.id],
		relationName: 'parent-company',
	}),
	subCompanies: many(companyTable, { relationName: 'parent-company' }),
}));

// Driver Licenses
//////////////////////////////////////////////////////////

export const driverLicenseTable = pgTable('driver_licenses', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	userId: uuid('user_id')
		.references(() => userTable.id, { onDelete: 'cascade' })
		.notNull(),
	number: varchar('number', { length: 128 }).notNull(),
	class: varchar('class', { length: 64 }).notNull(),
	capacity: decimal('capacity', { precision: 10, scale: 2 }),
	expirationDate: timestamp('expiration_date', { withTimezone: true, mode: 'date' }).notNull(),
	note: varchar('note', { length: 255 }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const driverLicenseRelations = relations(driverLicenseTable, ({ one }) => ({
	user: one(userTable, {
		fields: [driverLicenseTable.userId],
		references: [userTable.id],
	}),
}));

// Messages
//////////////////////////////////////////////////////////

export const messageTable = pgTable('messages', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	companyId: uuid('company_id')
		.references(() => companyTable.id, { onDelete: 'cascade' })
		.notNull(),
	content: varchar('content', { length: 255 }).notNull(),
	senderId: uuid('sender_id')
		.references(() => userTable.id, { onDelete: 'cascade' })
		.notNull(),
	receiverId: uuid('receiver_id')
		.references(() => userTable.id, { onDelete: 'cascade' })
		.notNull(),
	// file: uuid('file').references(() => filesTable.id, { onDelete: 'set null' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const messageRelations = relations(messageTable, ({ one }) => ({
	company: one(companyTable, {
		fields: [messageTable.companyId],
		references: [companyTable.id],
	}),
	sender: one(userTable, {
		fields: [messageTable.senderId],
		references: [userTable.id],
	}),
	receiver: one(userTable, {
		fields: [messageTable.receiverId],
		references: [userTable.id],
	}),
}));

// Prices
//////////////////////////////////////////////////////////

export const priceStatusEnum = pgEnum('price_status', PRICE_STATUS);
export const priceTypeEnum = pgEnum('price_type', PRICE_TYPES);

export const priceTable = pgTable(
	'prices',
	{
		id: uuid('id').primaryKey().defaultRandom().notNull(),
		companyId: uuid('company_id')
			.references(() => companyTable.id, { onDelete: 'cascade' })
			.notNull(),
		status: priceStatusEnum('status').default('active').notNull(),
		type: priceTypeEnum('type').default('base').notNull(),
		name: varchar('name', { length: 64 }).notNull(),
		value: decimal('value', { precision: 10, scale: 2 }).notNull(),
		taxable: boolean('taxable').default(true).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	},
	(table) => ({
		companyNameIdx: uniqueIndex('prices_company_name_idx').on(table.companyId, table.name),
	}),
);

export const priceRelations = relations(priceTable, ({ one, many }) => ({
	company: one(companyTable, {
		fields: [priceTable.companyId],
		references: [companyTable.id],
	}),
	conditions: many(priceConditionTable),
}));

// Price Conditions
//////////////////////////////////////////////////////////

export const priceConditionTypeEnum = pgEnum('price_condition_type', PRICE_CONDITION_TYPES);

export const priceConditionTable = pgTable('price_conditions', {
	id: serial('id').primaryKey().notNull(),
	priceId: uuid('price_id')
		.references(() => priceTable.id, { onDelete: 'cascade' })
		.notNull(),
	type: priceConditionTypeEnum('type').default('service_distance').notNull(),
	min: integer('min'),
	max: integer('max'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const priceConditionRelations = relations(priceConditionTable, ({ one }) => ({
	price: one(priceTable, {
		fields: [priceConditionTable.priceId],
		references: [priceTable.id],
	}),
}));

// Services
//////////////////////////////////////////////////////////

export const serviceStatusEnum = pgEnum('service_status', SERVICE_STATUS);

export const serviceTable = pgTable(
	'services',
	{
		id: uuid('id').primaryKey().defaultRandom().notNull(),
		companyId: uuid('company_id')
			.references(() => companyTable.id, { onDelete: 'cascade' })
			.notNull(),
		status: serviceStatusEnum('status').default('active').notNull(),
		name: varchar('name', { length: 64 }).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	},
	(table) => ({
		companyNameIdx: uniqueIndex('services_company_name_idx').on(table.companyId, table.name),
	}),
);

export const serviceRelations = relations(serviceTable, ({ one }) => ({
	company: one(companyTable, {
		fields: [serviceTable.companyId],
		references: [companyTable.id],
	}),
}));

// Towings
//////////////////////////////////////////////////////////

export const towingStatusEnum = pgEnum('towing_status', TOWING_STATUS);
export const towingTypeEnum = pgEnum('towing_type', TOWING_TYPES);

export const towingTable = pgTable(
	'towings',
	{
		id: uuid('id').primaryKey().defaultRandom().notNull(),
		companyId: uuid('company_id')
			.references(() => companyTable.id, { onDelete: 'cascade' })
			.notNull(),
		status: towingStatusEnum('status').default('active').notNull(),
		type: towingTypeEnum('type').default('semi_heavy').notNull(),
		name: varchar('name', { length: 64 }).notNull(),
		driverId: uuid('driver_id').references(() => userTable.id, { onDelete: 'set null' }),
		model: varchar('model', { length: 128 }),
		weight: decimal('weight', { precision: 10, scale: 2 }),
		plateNb: varchar('plate_number', { length: 128 }),
		serialNb: varchar('serial_number', { length: 128 }),
		brakeType: varchar('brake_type', { length: 30 }),
		capacity: decimal('capacity', { precision: 10, scale: 2 }),
		capacityBack: decimal('capacity_back', { precision: 10, scale: 2 }),
		capacityFront: decimal('capacity_front', { precision: 10, scale: 2 }),
		capacityThaw: decimal('capacity_thaw', { precision: 10, scale: 2 }),
		container: boolean('container').default(false).notNull(),
		gps: boolean('gps').default(false).notNull(),
		ifta: boolean('ifta').default(false).notNull(),
		plateHeight: decimal('plate_height', { precision: 10, scale: 2 }),
		plateLength: decimal('plate_length', { precision: 10, scale: 2 }),
		radiusBack: decimal('radius_back', { precision: 10, scale: 2 }),
		radiusFront: decimal('radius_front', { precision: 10, scale: 2 }),
		totalHeight: decimal('total_height', { precision: 10, scale: 2 }),
		totalLength: decimal('total_length', { precision: 10, scale: 2 }),
		wheelCount: integer('wheel_count'),
		wheelLift: boolean('wheel_lift').default(false).notNull(),
		note: varchar('note', { length: 255 }),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	},
	(table) => ({
		companyNameIdx: uniqueIndex('towings_company_name_idx').on(table.companyId, table.name),
	}),
);

export const towingRelations = relations(towingTable, ({ one }) => ({
	company: one(companyTable, {
		fields: [towingTable.companyId],
		references: [companyTable.id],
	}),
	driver: one(userTable, {
		fields: [towingTable.driverId],
		references: [userTable.id],
	}),
}));

// Services Prices Junction
//////////////////////////////////////////////////////////

export const serviceToPriceJunctionTable = pgTable(
	'service_to_price_junctions',
	{
		serviceId: uuid('service_id')
			.references(() => serviceTable.id, { onDelete: 'cascade' })
			.notNull(),
		priceId: uuid('price_id')
			.references(() => priceTable.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.serviceId, t.priceId] }),
	}),
);

export const serviceToPriceJunctionRelations = relations(
	serviceToPriceJunctionTable,
	({ one }) => ({
		service: one(serviceTable, {
			fields: [serviceToPriceJunctionTable.serviceId],
			references: [serviceTable.id],
		}),
		price: one(priceTable, {
			fields: [serviceToPriceJunctionTable.priceId],
			references: [priceTable.id],
		}),
	}),
);
