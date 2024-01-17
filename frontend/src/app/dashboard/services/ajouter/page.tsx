import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { getPrices } from 'src/server/actions/price.action';
import NewServicePageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Services',
		href: ROUTES.ServicesPage(),
	},
	{ name: 'Ajouter' },
];

const NewServicePage = async () => {
	const prices = await getPrices();

	return (
		<Container maxWidth="md">
			<PageHeader
				title="Créer un service"
				icon={<Icons.service />}
				iconHref={ROUTES.ServicesPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<NewServicePageView sx={{ mt: 4 }} prices={prices} />
		</Container>
	);
};

export default NewServicePage;
