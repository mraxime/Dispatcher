import { Box, Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Factures',
		href: ROUTES.BillsPage(),
	},
	{ name: 'Ajouter' },
];

const NewBillPage = () => {
	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Créer une facture"
				icon={<Icons.bill />}
				iconHref={ROUTES.BillsPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<Box mt={4}>En développement...</Box>
		</Container>
	);
};

export default NewBillPage;
