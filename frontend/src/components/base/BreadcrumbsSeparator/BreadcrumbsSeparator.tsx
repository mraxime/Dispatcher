import type { FC } from 'react';
import Box from '@mui/material/Box';

const BreadcrumbsSeparator: FC = () => (
	<Box
		sx={{
			backgroundColor: 'neutral.500',
			borderRadius: '50%',
			mx: 0.5,
			height: 4,
			width: 4,
		}}
	/>
);

export default BreadcrumbsSeparator;
