export const CLIENT_STATUS = ['active', 'inactive'] as const;

export const CLIENT_STATUS_MAP = {
	active: {
		value: 'active',
		title: 'Actif',
	},
	inactive: {
		value: 'inactive',
		title: 'Inactif',
	},
} satisfies {
	[key in ClientStatus]: {
		value: key;
		title: string;
	};
};

export type ClientStatus = (typeof CLIENT_STATUS)[number];
