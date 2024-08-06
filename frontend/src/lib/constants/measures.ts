export type MeasureType = 'METRIC' | 'IMPERIAL';

export const MEASURE_TYPES_MAP: {
	[key in MeasureType]: {
		value: key;
		title: string;
	};
} = {
	METRIC: {
		value: 'METRIC',
		title: 'Metrique (m, kg)',
	},
	IMPERIAL: {
		value: 'IMPERIAL',
		title: 'Imperial (pied, lb)',
	},
};
