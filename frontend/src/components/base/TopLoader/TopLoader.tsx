'use client';

import type { FC } from 'react';
import NextTopLoader, { type NextTopLoaderProps } from 'nextjs-toploader';
import { useTheme } from '@mui/material/styles';

const TopLoader: FC<NextTopLoaderProps> = (props) => {
	const theme = useTheme();
	return (
		<NextTopLoader
			color={theme.palette.primary.main}
			crawlSpeed={100}
			height={2}
			showSpinner={false}
			speed={250}
			zIndex={2000}
			{...props}
		/>
	);
};

export default TopLoader;
