export const PRICE_CONDITION_TYPES = ['service_distance', 'service_duration', 'day_time'] as const;

export const PRICE_CONDITION_TYPES_MAP = {
	service_duration: {
		value: 'service_duration',
		title: 'Durée du service',
		minLabel: 'Durée min',
		maxLabel: 'Durée max',
		adornmentLabel: 'h',
	},
	service_distance: {
		value: 'service_distance',
		title: 'Distance parcourue',
		minLabel: 'Distance min',
		maxLabel: 'Distance max',
		adornmentLabel: 'km',
	},
	day_time: {
		value: 'day_time',
		title: 'Heure dans la journée',
		minLabel: 'Heure min (0-24)',
		maxLabel: 'Heure max (0-24)',
		adornmentLabel: 'h',
	},
} satisfies {
	[key in PriceConditionType]: {
		value: key;
		title: string;
		minLabel: string;
		maxLabel: string;
		adornmentLabel: string;
	};
};

export type PriceConditionType = (typeof PRICE_CONDITION_TYPES)[number];
