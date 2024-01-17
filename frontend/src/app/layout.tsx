import type { FC, ReactNode } from 'react';

import ForceClient from 'src/components/base/ForceClient';
import Providers from 'src/components/base/Providers';
import Toaster from 'src/components/base/Toaster';
import TopLoader from 'src/components/base/TopLoader';

import 'src/assets/main.css';

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
				<Providers>
					<Toaster />
					<TopLoader />
					<ForceClient>{children}</ForceClient>
				</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
