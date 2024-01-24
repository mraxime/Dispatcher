'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import Cookies from 'js-cookie';

import TrailerForm, { type TrailerSubmitData } from 'src/components/trailers/TrailerForm';
import { useTrailerActions } from 'src/hooks/useTrailers';
import { ROUTES } from 'src/lib/constants/routes';
import type { Company } from 'src/lib/types/directus';

type Props = {
	companies: Company[];
	sx?: SxProps;
};

const NewTrailerPageView: FC<Props> = ({ companies, sx }) => {
	const router = useRouter();
	const trailerActions = useTrailerActions();
	const companyCookie = Cookies.get('company');

	const handleSubmit = async (data: TrailerSubmitData) => {
		await trailerActions.create(data);
		router.push(ROUTES.TrailersPage());
	};

	return (
		<Box sx={sx}>
			<TrailerForm
				mode="create"
				companies={companies}
				defaultValues={{ company: Number(companyCookie) }}
				onSubmit={handleSubmit}
			/>
		</Box>
	);
};

export default NewTrailerPageView;
