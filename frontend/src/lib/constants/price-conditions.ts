export type PriceConditionType = 'SERVICE_DISTANCE' | 'SERVICE_DURATION' | 'DAY_TIME';

export const PRICE_CONDITION_TYPES_MAP: {
	[key in PriceConditionType]: {
		value: key;
		title: string;
		minLabel: string;
		maxLabel: string;
		adornmentLabel: string;
	};
} = {
	SERVICE_DURATION: {
		value: 'SERVICE_DURATION',
		title: 'Durée du service',
		minLabel: 'Durée min',
		maxLabel: 'Durée max',
		adornmentLabel: 'h',
	},
	SERVICE_DISTANCE: {
		value: 'SERVICE_DISTANCE',
		title: 'Distance parcourue',
		minLabel: 'Distance min',
		maxLabel: 'Distance max',
		adornmentLabel: 'km',
	},
	DAY_TIME: {
		value: 'DAY_TIME',
		title: 'Heure dans la journée',
		minLabel: 'Heure min (0-24)',
		maxLabel: 'Heure max (0-24)',
		adornmentLabel: 'h',
	},
};
