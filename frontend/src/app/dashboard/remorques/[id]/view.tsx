'use client';

import type { FC } from 'react';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import TrailerForm, { type TrailerSubmitData } from 'src/components/trailers/TrailerForm';
import { useTrailerActions } from 'src/hooks/useTrailers';
import type { Trailer } from 'src/lib/types/directus';

type Props = {
	trailer: Trailer;
	sx?: SxProps;
};

const TrailerPageView: FC<Props> = ({ trailer, sx }) => {
	const trailerActions = useTrailerActions();

	const handleSubmit = async (data: TrailerSubmitData) => {
		await trailerActions.update(trailer.id, data);
	};

	return (
		<Box sx={sx}>
			{/* @ts-expect-error - data.company is a number. */}
			<TrailerForm mode="update" defaultValues={trailer} onSubmit={handleSubmit} />
		</Box>
	);
};

export default TrailerPageView;
