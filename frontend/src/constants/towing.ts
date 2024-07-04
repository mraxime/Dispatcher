export const TOWING_STATUS = ['active', 'inactive'] as const;

export const TOWING_STATUS_MAP = {
	active: {
		value: 'active',
		title: 'Actif',
	},
	inactive: {
		value: 'inactive',
		title: 'Inactif',
	},
} satisfies {
	[key in TowingStatus]: {
		value: key;
		title: string;
	};
};

export const TOWING_TYPES = ['light', 'semi_heavy', 'heavy'] as const;

export const TOWING_TYPES_MAP = {
	light: {
		value: 'light',
		title: 'Légé',
	},
	semi_heavy: {
		value: 'semi_heavy',
		title: 'Semi-lourd',
	},
	heavy: {
		value: 'heavy',
		title: 'Lourd',
	},
} satisfies {
	[key in TowingType]: {
		value: key;
		title: string;
	};
};

export type TowingStatus = (typeof TOWING_STATUS)[number];
export type TowingType = (typeof TOWING_TYPES)[number];
