import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import CallForm from 'src/components/call/CallForm';
import { ROUTES } from 'src/constants/routes';
import { getClients, getServices, getTowings, getUsers } from 'src/server/services';
import { pageGuard } from '../../guard';

const NewCallPage = async () => {
	const session = await pageGuard('calls:read', 'calls:create');

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
		{ name: 'Ajouter' },
	];

	return (
		<Container maxWidth="md">
			<PageHeader
				title="Créer un appel"
				icon={<Icons.call />}
				iconHref={ROUTES.CallsPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<Box mt={4}>
				<CallForm
					defaultValues={{
						companyId: session.selectedCompany.id,
						origin: session.selectedCompany.address,
					}}
					clients={clients}
					drivers={drivers}
					services={services}
					towings={towings}
				/>
			</Box>
		</Container>
	);
};

export default NewCallPage;
