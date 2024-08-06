import { alpha } from '@mui/material/styles';
import type { PaletteOptions } from '@mui/material/styles/createPalette';

import type { ColorPreset, Contrast } from '..';
import { error, info, neutral, success, warning } from '../colors';
import { getPrimary } from '../utils';

interface Config {
	colorPreset?: ColorPreset;
	contrast?: Contrast;
}

export const createPalette = (config: Config): PaletteOptions => {
	const { colorPreset, contrast } = config;

	return {
		action: {
			active: neutral[500],
			disabled: alpha(neutral[100], 0.38),
			disabledBackground: alpha(neutral[100], 0.12),
			focus: alpha(neutral[100], 0.16),
			hover: alpha(neutral[100], 0.04),
			selected: alpha(neutral[100], 0.12),
		},
		background: {
			default: contrast === 'high' ? 'hsl(223, 39%, 7%)' : 'hsl(223, 39%, 9%)',
			paper: neutral[900],
		},
		divider: '#27303F',
		error,
		info,
		mode: 'dark',
		neutral,
		primary: getPrimary(colorPreset),
		success,
		text: {
			primary: '#EDF2F7',
			secondary: '#A0AEC0',
			disabled: 'rgba(255, 255, 255, 0.48)',
		},
		warning,
	};
};
