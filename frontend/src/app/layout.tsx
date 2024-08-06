import type { FC, ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { NextAppDirEmotionCacheProvider } from 'tss-react/next/appDir';

import Providers from 'src/components/base/Providers';
import TopLoader from 'src/components/base/TopLoader';
import { ThemeProvider } from 'src/contexts/theme-context';

import 'src/assets/main.css';

import Toaster from 'src/components/base/Toaster';

type Props = {
	children: ReactNode;
};

const RootLayout: FC<Props> = ({ children }) => {
	return (
		<html lang="fr">
			<head>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
				<link rel="shortcut icon" href="/favicon.ico" />
			</head>
			<body>
				<NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
					<ThemeProvider>
						<CssBaseline />
						<TopLoader />
						<Providers>{children}</Providers>
						<Toaster />
					</ThemeProvider>
				</NextAppDirEmotionCacheProvider>
			</body>
		</html>
	);
};

export default RootLayout;
