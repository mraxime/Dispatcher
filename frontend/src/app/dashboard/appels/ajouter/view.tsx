'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import Cookies from 'js-cookie';

import CallForm, { type CallSubmitData } from 'src/components/calls/CallForm';
import { useCallActions } from 'src/hooks/useCalls';
import { ROUTES } from 'src/lib/constants/routes';
import type { Client, Service, Trailer, User } from 'src/lib/types/directus';

type Props = {
	clients: Client[];
	drivers: User[];
	services: Service[];
	trailers: Trailer[];
	sx?: SxProps;
};

const NewCallPageView: FC<Props> = ({ clients, drivers, services, trailers, sx }) => {
	const router = useRouter();
	const callActions = useCallActions();
	const companyCookie = Cookies.get('company');

	const handleSubmit = async (data: CallSubmitData) => {
		await callActions.create(data);
		router.push(ROUTES.CallsPage());
	};

	return (
		<Box sx={sx}>
			<CallForm
				mode="create"
				defaultValues={{ company: Number(companyCookie) }}
				services={services}
				trailers={trailers}
				clients={clients}
				drivers={drivers}
				onSubmit={handleSubmit}
			/>
		</Box>
	);
};

export default NewCallPageView;
