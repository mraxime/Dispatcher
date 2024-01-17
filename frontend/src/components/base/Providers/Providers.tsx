'use client';

import { useMemo, type FC, type ReactNode } from 'react';
import Head from 'next/head';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fr } from 'date-fns/locale';
import Cookies from 'js-cookie';
import { NextAppDirEmotionCacheProvider } from 'tss-react/next/appDir';

import { createTheme, type PaletteMode, type ThemeConfig } from 'src/assets/theme';

const getThemeConfig = (mode?: PaletteMode): ThemeConfig => ({
	paletteMode: mode === 'dark' ? 'dark' : 'light',
	contrast: mode === 'dark' ? 'normal' : 'high',
	colorPreset: 'indigo',
	responsiveFontSizes: true,
	direction: 'ltr',
});

const queryClient = new QueryClient();

type Props = {
	children?: ReactNode;
};

/**
 * Collections of providers to be used at app root layout.
 */
const Providers: FC<Props> = ({ children }) => {
	const themeCookie = Cookies.get('theme') as 'light' | 'dark' | undefined;
	const themeConfig = useMemo(() => getThemeConfig(themeCookie), [themeCookie]);
	const theme = useMemo(() => createTheme(themeConfig), [themeConfig]);

	return (
		<>
			<Head>
				<meta name="color-scheme" content={themeConfig.paletteMode} />
				<meta name="theme-color" content={theme.palette.neutral[900]} />
			</Head>
			<NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
						<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
					</LocalizationProvider>
				</ThemeProvider>
			</NextAppDirEmotionCacheProvider>
		</>
	);
};

export default Providers;
