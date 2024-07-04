export const PRICE_STATUS = ['active', 'inactive'] as const;

export const PRICE_STATUS_MAP = {
	active: {
		value: 'active',
		title: 'Actif',
	},
	inactive: {
		value: 'inactive',
		title: 'Inactif',
	},
} satisfies {
	[key in PriceStatus]: {
		value: key;
		title: string;
	};
};

export const PRICE_TYPES = ['base', 'per_hour', 'per_km'] as const;

export const PRICE_TYPES_MAP = {
	base: {
		value: 'base',
		title: 'Prix régulier',
		adornment: '',
	},
	per_hour: {
		value: 'per_hour',
		title: 'Prix par heure',
		adornment: '/h',
	},
	per_km: {
		value: 'per_km',
		title: 'Prix par Km',
		adornment: '/km',
	},
} satisfies {
	[key in PriceType]: {
		value: key;
		title: string;
		adornment: string;
	};
};

export type PriceStatus = (typeof PRICE_STATUS)[number];
export type PriceType = (typeof PRICE_TYPES)[number];
