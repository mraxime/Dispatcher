import 'src/assets/main.css';
import type { FC, ReactNode } from 'react';
import Toaster from 'src/components/base/Toaster';
import TopLoader from 'src/components/base/TopLoader';
import { getSession } from 'src/server/services';
import { LocalizationProvider } from './_components/LocalizationProvider';
import { ThemeProvider } from './_components/ThemeProvider';

type Props = {
	children: ReactNode;
};

const RootLayout: FC<Props> = async ({ children }) => {
	const { user } = await getSession();

	return (
		<html lang="fr">
			<head>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
				<link rel="shortcut icon" href="/favicon.ico" />
			</head>
			<body>
				<LocalizationProvider>
					<ThemeProvider themeMode={user?.theme ?? 'light'}>
						<Toaster />
						<TopLoader />
						{children}
					</ThemeProvider>
				</LocalizationProvider>
			</body>
		</html>
	);
};

export default RootLayout;
