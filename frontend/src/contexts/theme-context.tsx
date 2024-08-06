'use client';

import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type FC,
	type ReactNode,
} from 'react';
import Head from 'next/head';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';

import { createTheme, type PaletteMode, type ThemeConfig } from 'src/assets/theme';

const THEME_CONFIG_LIGHT: ThemeConfig = {
	paletteMode: 'light',
	contrast: 'high',
	colorPreset: 'indigo',
	responsiveFontSizes: true,
	direction: 'ltr',
};

const THEME_CONFIG_DARK: ThemeConfig = {
	paletteMode: 'dark',
	contrast: 'normal',
	colorPreset: 'indigo',
	responsiveFontSizes: true,
	direction: 'ltr',
};

type ContextValue = {
	current: ThemeConfig;
	setMode: (mode: PaletteMode) => void;
	toggleMode: () => void;
};

const Context = createContext<ContextValue>(undefined!);

export const useThemeConfig = () => {
	const contextValue = useContext(Context);
	if (contextValue === undefined) {
		throw new Error('useThemeConfig must be within ThemeProvider');
	}
	return contextValue;
};

type Props = {
	children: ReactNode;
};

export const ThemeProvider: FC<Props> = ({ children }) => {
	const themeCookie = Cookies.get('theme');
	const [config, setConfig] = useState(
		themeCookie === 'dark' ? THEME_CONFIG_DARK : THEME_CONFIG_LIGHT,
	);

	const theme = useMemo(() => createTheme(config), [config]);

	useEffect(() => {
		if (themeCookie === 'light') setConfig(THEME_CONFIG_LIGHT);
		else if (themeCookie === 'dark') setConfig(THEME_CONFIG_DARK);
	}, [themeCookie]);

	const contextValue = useMemo(
		() => ({
			current: config,
			setMode: (mode: PaletteMode) => {
				setConfig(mode === 'dark' ? THEME_CONFIG_DARK : THEME_CONFIG_LIGHT);
			},
			toggleMode: () => {
				setConfig((previousConfig) =>
					previousConfig.paletteMode === 'light' ? THEME_CONFIG_DARK : THEME_CONFIG_LIGHT,
				);
			},
		}),
		[config],
	);

	return (
		<MuiThemeProvider theme={theme}>
			<Head>
				<meta name="color-scheme" content={config.paletteMode} />
				<meta name="theme-color" content={theme.palette.neutral[900]} />
			</Head>
			<Context.Provider value={contextValue}>{children}</Context.Provider>
		</MuiThemeProvider>
	);
};
