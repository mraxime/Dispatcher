import { Box, Container, Grid, Stack } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import CallDispatcher from 'src/components/call/CallDispatcher';
import CallForm from 'src/components/call/CallForm';
import CallPriceCard from 'src/components/call/CallPriceCard';
import CallTrajectCard from 'src/components/call/CallTrajectCard';
import { ROUTES } from 'src/constants/routes';
import { getCall, getClients, getServices, getTowings, getUsers } from 'src/server/services';
import { pageGuard } from '../../guard';

const ClientPage = async ({ params }: { params: { id: string } }) => {
	const session = await pageGuard('calls:read');
	const call = await getCall(params.id, {
		client: session.permissionKeys.includes('clients:read') ? true : undefined,
		vehicle: session.permissionKeys.includes('clients:read') ? true : undefined,
	});

	const clients = session.permissionKeys.includes('clients:read') ? await getClients() : [];
	const drivers = session.permissionKeys.includes('users:read')
		? await getUsers({ role: 'driver' })
		: [];
	const services = session.permissionKeys.includes('services:read') ? await getServices() : [];
	const towings = session.permissionKeys.includes('towings:read') ? await getTowings() : [];

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Appels',
			href: ROUTES.CallsPage(),
		},
		{ name: 'Modifier' },
	];

	return (
		<Container maxWidth="xl">
			<PageHeader
				title={`Formulaire d'appel`}
				icon={<Icons.call />}
				iconHref={ROUTES.CallsPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<Grid container spacing={4}>
					<Grid item xs={12} md={9}>
						<CallForm
							id={params.id}
							defaultValues={call}
							clients={clients}
							drivers={drivers}
							services={services}
							towings={towings}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<Stack spacing={4}>
							<CallDispatcher data={call} drivers={drivers} towings={towings} />
							<CallTrajectCard data={call} />
							<CallPriceCard data={call} />
						</Stack>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
};

export default ClientPage;
