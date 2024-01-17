import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { getPrices } from 'src/server/actions/price.action';
import { getService } from 'src/server/actions/service.action';
import ServicePageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Services',
		href: ROUTES.ServicesPage(),
	},
	{ name: 'Modifier' },
];

const ServicePage = async ({ params }: { params: { id: string } }) => {
	const [service, prices] = await Promise.all([getService(Number(params.id)), getPrices()]);

	return (
		<Container maxWidth="md">
			<PageHeader
				title={service.name}
				icon={<Icons.service />}
				iconHref={ROUTES.ServicesPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<ServicePageView sx={{ mt: 4 }} service={service} prices={prices} />
		</Container>
	);
};

export default ServicePage;
