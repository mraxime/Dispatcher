export type PriceStatus = 'ACTIVE' | 'INACTIVE';
export type PriceType = 'BASE' | 'PER_HOUR' | 'PER_KM';

export const PRICE_STATUS_MAP: {
	[key in PriceStatus]: {
		value: key;
		title: string;
	};
} = {
	ACTIVE: {
		value: 'ACTIVE',
		title: 'Actifs',
	},
	INACTIVE: {
		value: 'INACTIVE',
		title: 'Inactifs',
	},
};

export const PRICE_TYPES_MAP: {
	[key in PriceType]: {
		value: key;
		title: string;
		adornment?: string;
	};
} = {
	BASE: {
		value: 'BASE',
		title: 'Prix régulier',
	},
	PER_HOUR: {
		value: 'PER_HOUR',
		title: 'Prix par heure',
		adornment: '/h',
	},
	PER_KM: {
		value: 'PER_KM',
		title: 'Prix par Km',
		adornment: '/km',
	},
};
