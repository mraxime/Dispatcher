'use client';

import type { FC } from 'react';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import ServiceForm, { type ServiceSubmitData } from 'src/components/services/ServiceForm';
import { useServiceActions } from 'src/hooks/useServices';
import type { Price, Service } from 'src/lib/types/directus';

type Props = {
	service: Service;
	prices: Price[];
	sx?: SxProps;
};

const ServicePageView: FC<Props> = ({ service, prices, sx }) => {
	const serviceActions = useServiceActions();

	const handleSubmit = async (data: ServiceSubmitData) => {
		await serviceActions.update(service.id, data);
	};

	return (
		<Box sx={sx}>
			<ServiceForm
				mode="update"
				/* @ts-expect-error - data.company is a number. */
				defaultValues={service}
				prices={prices}
				onSubmit={handleSubmit}
			/>
		</Box>
	);
};

export default ServicePageView;
