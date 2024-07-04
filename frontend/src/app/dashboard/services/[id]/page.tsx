import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import ServiceForm from 'src/components/service/ServiceForm';
import { ROUTES } from 'src/constants/routes';
import { getPrices, getService } from 'src/server/services';
import { pageGuard } from '../../guard';

const ServicePage = async ({ params }: { params: { id: string } }) => {
	const session = await pageGuard('services:read');
	const service = await getService(params.id);
	const prices = session.permissionKeys.includes('prices:read') ? await getPrices() : [];

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Services',
			href: ROUTES.ServicesPage(),
		},
		{ name: 'Modifier' },
	];

	return (
		<Container maxWidth="md">
			<PageHeader
				title={service.name}
				icon={<Icons.service />}
				iconHref={ROUTES.ServicesPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<Box mt={4}>
				<ServiceForm id={service.id} defaultValues={service} prices={prices} />
			</Box>
		</Container>
	);
};

export default ServicePage;
