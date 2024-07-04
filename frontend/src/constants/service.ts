export const SERVICE_STATUS = ['active', 'inactive'] as const;

export const SERVICE_STATUS_MAP = {
	active: {
		value: 'active',
		title: 'Actif',
	},
	inactive: {
		value: 'inactive',
		title: 'Inactif',
	},
} satisfies {
	[key in ServiceStatus]: {
		value: key;
		title: string;
	};
};

export type ServiceStatus = (typeof SERVICE_STATUS)[number];
