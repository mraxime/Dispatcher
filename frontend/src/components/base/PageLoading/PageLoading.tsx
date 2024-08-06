'use client';

import type { FC } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

/**
 * Full page loader.
 */
const PageLoading: FC = () => {
	return (
		<Backdrop
			open
			invisible
			sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, pointerEvents: 'none' }}
		>
			<CircularProgress size={40} />
		</Backdrop>
	);
};

export default PageLoading;
