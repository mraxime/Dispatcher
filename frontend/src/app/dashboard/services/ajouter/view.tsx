'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material';
import Cookies from 'js-cookie';

import ServiceForm, { type ServiceSubmitData } from 'src/components/services/ServiceForm';
import { useServiceActions } from 'src/hooks/useServices';
import { ROUTES } from 'src/lib/constants/routes';
import type { Price } from 'src/lib/types/directus';

type Props = {
	prices: Price[];
	sx?: SxProps;
};

const NewServicePageView: FC<Props> = ({ prices, sx }) => {
	const router = useRouter();
	const serviceActions = useServiceActions();
	const companyCookie = Cookies.get('company');

	const handleSubmit = async (data: ServiceSubmitData) => {
		await serviceActions.create(data);
		router.push(ROUTES.ServicesPage());
	};

	return (
		<Box sx={sx}>
			<ServiceForm
				mode="create"
				defaultValues={{ company: Number(companyCookie) }}
				prices={prices}
				onSubmit={handleSubmit}
			/>
		</Box>
	);
};

export default NewServicePageView;
