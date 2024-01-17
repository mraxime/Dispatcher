'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Grid, Stack } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import CallDispatcher from 'src/components/calls/CallDispatcher';
import CallForm, { type CallSubmitData } from 'src/components/calls/CallForm';
import CallPriceCard from 'src/components/calls/CallPriceCard';
import CallTrajectCard from 'src/components/calls/CallTrajectCard';
import { useCallActions } from 'src/hooks/useCalls';
import type { CallStatus } from 'src/lib/constants/calls';
import { ROUTES } from 'src/lib/constants/routes';
import type { Call, Client, Service, Trailer, User } from 'src/lib/types/directus';

type Props = {
	call: Call;
	clients: Client[];
	drivers: User[];
	services: Service[];
	trailers: Trailer[];
	sx?: SxProps;
};

const CallPageView: FC<Props> = ({ call, clients, drivers, services, trailers, sx }) => {
	const router = useRouter();
	const callActions = useCallActions();

	const handleSubmit = async (data: CallSubmitData) => {
		await callActions.update(call.id, data);
	};

	const handleDispatch = async (data: { status: CallStatus; driver?: User; trailer?: Trailer }) => {
		await callActions.update(call.id, {
			status: data.status,
			driver: data.driver?.id,
			driver_truck: data.trailer?.id,
		});
		router.push(ROUTES.CallsPage());
	};

	return (
		<Box sx={sx}>
			<Grid container spacing={4}>
				<Grid item xs={12} md={9}>
					<CallForm
						mode="update"
						// @ts-expect-error - data.company is a number because relation is not included.
						defaultValues={call}
						clients={clients}
						drivers={drivers}
						services={services}
						trailers={trailers}
						onSubmit={handleSubmit}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<Stack spacing={4}>
						<CallDispatcher
							data={call}
							drivers={drivers}
							trailers={trailers}
							onSubmit={handleDispatch}
						/>
						<CallTrajectCard data={call} />
						<CallPriceCard data={call} />
					</Stack>
				</Grid>
			</Grid>
		</Box>
	);
};

export default CallPageView;
