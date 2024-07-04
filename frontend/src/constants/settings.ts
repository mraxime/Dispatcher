export const THEME_MODES = ['light', 'dark'] as const;

export const THEME_MODES_MAP = {
	light: {
		value: 'light',
		title: 'Jour',
	},
	dark: {
		value: 'dark',
		title: 'Nuit',
	},
} satisfies {
	[key in ThemeMode]: {
		value: key;
		title: string;
	};
};

export const MEASURE_TYPES = ['metric', 'imperial'] as const;

export const MEASURE_TYPES_MAP = {
	metric: {
		value: 'metric',
		title: 'Metrique (m, kg)',
	},
	imperial: {
		value: 'imperial',
		title: 'Imperial (pied, lb)',
	},
} satisfies {
	[key in MeasureType]: {
		value: key;
		title: string;
	};
};

export type ThemeMode = (typeof THEME_MODES)[number];
export type MeasureType = (typeof MEASURE_TYPES)[number];
