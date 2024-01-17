import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { getCall } from 'src/server/actions/call.action';
import { getClients } from 'src/server/actions/client.action';
import { getServices } from 'src/server/actions/service.action';
import { getTrailers } from 'src/server/actions/trailer.action';
import { getUsers } from 'src/server/actions/user.action';
import CallPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Appels', href: ROUTES.CallsPage() },
	{ name: 'Modifier' },
];

const CallPage = async ({ params }: { params: { id: number } }) => {
	const [call, clients, drivers, services, trailers] = await Promise.all([
		getCall(params.id, { fields: ['*', { vehicle: ['*'] }] }),
		getClients(),
		getUsers({
			filter: { role: { name: { _eq: 'Chauffeur' } } },
		}),
		getServices(),
		getTrailers(),
	]);

	return (
		<Container maxWidth="xl">
			<PageHeader
				title={`Formulaire d'appel: ${call.name}`}
				icon={<Icons.call />}
				iconHref={ROUTES.CallsPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<CallPageView
				sx={{ mt: 4 }}
				call={call}
				clients={clients}
				drivers={drivers}
				services={services}
				trailers={trailers}
			/>
		</Container>
	);
};

export default CallPage;
