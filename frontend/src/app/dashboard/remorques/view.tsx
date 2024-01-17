'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import TrailersTable from 'src/components/trailers/TrailersTable';
import { useTrailerActions } from 'src/hooks/useTrailers';
import { ROUTES } from 'src/lib/constants/routes';
import type { Trailer, TrailerParams } from 'src/lib/types/directus';

type Props = {
	trailers: Trailer[];
	params: TrailerParams;
	sx?: SxProps;
};

const TrailersPageView: FC<Props> = ({ trailers, params, sx }) => {
	const router = useRouter();
	const trailerActions = useTrailerActions();

	return (
		<Box sx={sx}>
			<TrailersTable
				data={trailers}
				params={params}
				onRefresh={trailerActions.revalidate}
				onParamsChange={trailerActions.setParams}
				onEdit={(id) => router.push(ROUTES.TrailerPage(id))}
				onDelete={trailerActions.delete}
			/>
		</Box>
	);
};

export default TrailersPageView;
