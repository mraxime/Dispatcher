import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import ClientForm from 'src/components/client/ClientForm';
import { ROUTES } from 'src/constants/routes';
import { pageGuard } from '../../guard';

const NewClientPage = async () => {
	const session = await pageGuard('clients:read', 'clients:create');

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Clients',
			href: ROUTES.ClientsPage(),
		},
		{ name: 'Ajouter' },
	];

	return (
		<Container maxWidth="md">
			<PageHeader
				title="Créer un client"
				icon={<Icons.client />}
				iconHref={ROUTES.ClientsPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<Box mt={4}>
				<ClientForm defaultValues={{ companyId: session.user.selectedCompanyId }} />
			</Box>
		</Container>
	);
};

export default NewClientPage;
