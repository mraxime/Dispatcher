import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import Maintenance from 'src/components/base/Maintenance';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/constants/routes';
import { pageGuard } from '../../guard';

const NewBillPage = async () => {
	const session = await pageGuard('bills:read', 'bills:create');

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Factures',
			href: ROUTES.BillsPage(),
		},
		{ name: 'Ajouter' },
	];

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Créer une facture"
				icon={<Icons.bill />}
				iconHref={ROUTES.BillsPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<Maintenance />
			</Box>
		</Container>
	);
};

export default NewBillPage;
