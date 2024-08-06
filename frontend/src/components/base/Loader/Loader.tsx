import type { FC } from 'react';
import { CircularProgress } from '@mui/material';

const Loader: FC = () => {
	return (
		<div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
			<CircularProgress size={55} />
		</div>
	);
};

export default Loader;
