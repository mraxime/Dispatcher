'use client';

import { useRouter } from 'next/navigation';
import { Box, Container, Grid, Stack } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import PageLoading from 'src/components/base/PageLoading';
import CallDispatcher from 'src/components/calls/CallDispatcher';
import CallForm, { type CallSubmitData } from 'src/components/calls/CallForm';
import CallPriceCard from 'src/components/calls/CallPriceCard';
import CallTrajectCard from 'src/components/calls/CallTrajectCard';
import { useCall } from 'src/hooks/useCalls';
import { useClients } from 'src/hooks/useClients';
import { useServices } from 'src/hooks/useServices';
import { useTrailers } from 'src/hooks/useTrailers';
import { useUsers } from 'src/hooks/useUsers';
import type { CallStatus } from 'src/lib/constants/calls';
import { ROUTES } from 'src/lib/constants/routes';
import type { Trailer, User } from 'src/lib/types/directus';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Appels', href: ROUTES.CallsPage() },
	{ name: 'Modifier' },
];

const CallPage = ({ params }: { params: { id: number } }) => {
	const router = useRouter();
	const call = useCall(params.id, { fields: ['*', { vehicle: ['*'] }] });
	const services = useServices();
	const trailers = useTrailers();
	const clients = useClients();
	const drivers = useUsers({
		filter: { role: { name: { _eq: 'Chauffeur' } } },
	});

	if (
		!call.data ||
		services.isLoading ||
		trailers.isLoading ||
		clients.isLoading ||
		drivers.isLoading
	) {
		return <PageLoading />;
	}

	const handleSubmit = async (data: CallSubmitData) => {
		await call.update(data);
	};

	const handleDispatch = async (data: { status: CallStatus; driver?: User; trailer?: Trailer }) => {
		await call.update({
			status: data.status,
			driver: data.driver?.id,
			driver_truck: data.trailer?.id,
		});
		router.push(ROUTES.CallsPage());
	};

	return (
		<Container maxWidth="xl">
			<Header
				title={`Formulaire d'appel: ${call.data.name}`}
				icon={<Icons.call />}
				iconHref={ROUTES.CallsPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<Grid container spacing={4}>
					<Grid item xs={12} md={9}>
						<CallForm
							mode="update"
							// @ts-expect-error - data.company is a number because relation is not included.
							defaultValues={call.data}
							services={services.data}
							trailers={trailers.data}
							clients={clients.data}
							drivers={drivers.data}
							onSubmit={handleSubmit}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<Stack spacing={4}>
							<CallDispatcher
								data={call.data}
								drivers={drivers.data}
								trailers={trailers.data}
								onSubmit={handleDispatch}
							/>
							<CallTrajectCard data={call.data} />
							<CallPriceCard data={call.data} />
						</Stack>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
};

export default CallPage;
