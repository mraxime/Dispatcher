import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { getClients } from 'src/server/actions/client.action';
import { getServices } from 'src/server/actions/service.action';
import { getTrailers } from 'src/server/actions/trailer.action';
import { getUsers } from 'src/server/actions/user.action';
import NewCallPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Appels', href: ROUTES.CallsPage() },
	{ name: 'Ajouter' },
];

const NewCallPage = async () => {
	const [clients, drivers, services, trailers] = await Promise.all([
		getClients(),
		getUsers({ filter: { role: { name: { _eq: 'Chauffeur' } } } }),
		getServices(),
		getTrailers(),
	]);

	return (
		<Container maxWidth="md">
			<PageHeader
				title="Créer un formulaire d'appel"
				icon={<Icons.call />}
				iconHref={ROUTES.CallsPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<NewCallPageView
				sx={{ mt: 4 }}
				services={services}
				trailers={trailers}
				clients={clients}
				drivers={drivers}
			/>
		</Container>
	);
};

export default NewCallPage;
