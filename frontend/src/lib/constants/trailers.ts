export type TrailerType = 'LIGHT' | 'SEMI_HEAVY' | 'HEAVY';

export const TRAILER_TYPES_MAP: {
	[key in TrailerType]: {
		value: key;
		title: string;
	};
} = {
	LIGHT: {
		value: 'LIGHT',
		title: 'Légé',
	},
	SEMI_HEAVY: {
		value: 'SEMI_HEAVY',
		title: 'Semi-lourd',
	},
	HEAVY: {
		value: 'HEAVY',
		title: 'Lourd',
	},
};
