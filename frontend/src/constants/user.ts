export const USER_STATUS = ['active', 'inactive'] as const;

export const USER_STATUS_MAP = {
	active: {
		value: 'active',
		title: 'Actif',
	},
	inactive: {
		value: 'inactive',
		title: 'Inactif',
	},
} satisfies {
	[key in UserStatus]: {
		value: key;
		title: string;
	};
};

export const USER_ROLES = [
	'super_admin',
	'admin',
	'dispatcher',
	'supervisor',
	'driver',
	'mechanic',
	'employee',
] as const;

export const USER_ROLES_MAP = {
	super_admin: {
		value: 'super_admin',
		title: 'Super Admin',
	},
	admin: {
		value: 'admin',
		title: 'Admin',
	},
	dispatcher: {
		value: 'dispatcher',
		title: 'Répartiteur',
	},
	supervisor: {
		value: 'supervisor',
		title: 'Superviseur',
	},
	driver: {
		value: 'driver',
		title: 'Chauffeur',
	},
	mechanic: {
		value: 'mechanic',
		title: 'Mécanicien',
	},
	employee: {
		value: 'employee',
		title: 'Employé',
	},
} satisfies {
	[key in UserRole]: {
		value: key;
		title: string;
	};
};

export const PERMISSION_KEYS = [
	// bills
	'bills:read',
	'bills:create',
	'bills:update',
	'bills:delete',

	// calendars
	'calendars:read',
	'calendars:create',
	'calendars:update',
	'calendars:delete',

	// calendar events
	'calendar-events:read',
	'calendar-events:create',
	'calendar-events:update',
	'calendar-events:delete',

	// calls
	'calls:read',
	'calls:create',
	'calls:update',
	'calls:delete',

	// clients
	'clients:read',
	'clients:create',
	'clients:update',
	'clients:delete',

	// companies
	'companies:read',
	'companies:create',
	'companies:update',
	'companies:delete',

	// messages
	'messages:read',
	'messages:create',
	'messages:update',
	'messages:delete',

	// prices
	'prices:read',
	'prices:create',
	'prices:update',
	'prices:delete',

	// services
	'services:read',
	'services:create',
	'services:update',
	'services:delete',

	// prices
	'towings:read',
	'towings:create',
	'towings:update',
	'towings:delete',

	// users
	'users:read',
	'users:create',
	'users:update',
	'users:delete',
] as const;

export type UserStatus = (typeof USER_STATUS)[number];
export type UserRole = (typeof USER_ROLES)[number];
export type PermissionKey = (typeof PERMISSION_KEYS)[number];
