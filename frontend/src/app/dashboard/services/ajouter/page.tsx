import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import ServiceForm from 'src/components/service/ServiceForm';
import { ROUTES } from 'src/constants/routes';
import { getPrices } from 'src/server/services';
import { pageGuard } from '../../guard';

const NewServicePage = async () => {
	const session = await pageGuard('services:read', 'services:create');
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
		{ name: 'Ajouter' },
	];

	return (
		<Container maxWidth="md">
			<PageHeader
				title="Créer un service"
				icon={<Icons.service />}
				iconHref={ROUTES.ServicesPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<Box mt={4}>
				<ServiceForm
					defaultValues={{ companyId: session.user.selectedCompanyId }}
					prices={prices}
				/>
			</Box>
		</Container>
	);
};

export default NewServicePage;
