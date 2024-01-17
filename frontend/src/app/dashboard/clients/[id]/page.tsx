import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { getClient } from 'src/server/actions/client.action';
import ClientPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Clients',
		href: ROUTES.ClientsPage(),
	},
	{ name: 'Modifier' },
];

const ClientPage = async ({ params }: { params: { id: string } }) => {
	const client = await getClient(Number(params.id));

	return (
		<Container maxWidth="md">
			<PageHeader
				title={client.name}
				icon={<Icons.client />}
				iconHref={ROUTES.ClientsPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<ClientPageView sx={{ mt: 4 }} client={client} />
		</Container>
	);
};

export default ClientPage;
