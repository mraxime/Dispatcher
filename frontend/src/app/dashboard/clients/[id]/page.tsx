import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import ClientForm from 'src/components/client/ClientForm';
import { ROUTES } from 'src/constants/routes';
import { getClient } from 'src/server/services';
import { pageGuard } from '../../guard';

const ClientPage = async ({ params }: { params: { id: string } }) => {
	const session = await pageGuard('clients:read');
	const client = await getClient(params.id);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Clients',
			href: ROUTES.ClientsPage(),
		},
		{ name: 'Modifier' },
	];

	return (
		<Container maxWidth="md">
			<PageHeader
				title={client.firstName + ' ' + client.lastName}
				icon={<Icons.client />}
				iconHref={ROUTES.ClientsPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<Box mt={4}>
				<ClientForm id={client.id} defaultValues={client} />
			</Box>
		</Container>
	);
};

export default ClientPage;
