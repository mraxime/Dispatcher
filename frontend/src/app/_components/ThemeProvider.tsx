'use client';

import { useMemo, type FC, type ReactNode } from 'react';
import Head from 'next/head';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme, type ThemeConfig } from 'src/assets/theme';
import type { ThemeMode } from 'src/constants/settings';
import EmotionCache from './EmotionCache';

const getThemeConfig = (mode?: ThemeMode): ThemeConfig => ({
	paletteMode: mode === 'dark' ? 'dark' : 'light',
	contrast: mode === 'dark' ? 'normal' : 'high',
	colorPreset: 'indigo',
	responsiveFontSizes: true,
	direction: 'ltr',
});

type Props = {
	themeMode?: ThemeMode;
	children?: ReactNode;
};

export const ThemeProvider: FC<Props> = ({ themeMode, children }) => {
	const themeConfig = useMemo(() => getThemeConfig(themeMode), [themeMode]);
	const theme = useMemo(() => createTheme(themeConfig), [themeConfig]);

	return (
		<>
			<Head>
				<meta name="color-scheme" content={themeConfig.paletteMode} />
				<meta name="theme-color" content={theme.palette.neutral[900]} />
			</Head>
			<EmotionCache options={{ key: 'mui' }}>
				<MuiThemeProvider theme={theme}>
					<CssBaseline />
					{children}
				</MuiThemeProvider>
			</EmotionCache>
		</>
	);
};
