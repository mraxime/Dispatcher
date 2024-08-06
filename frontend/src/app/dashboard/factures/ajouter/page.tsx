'use client';

import { Box, Container } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
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
			<Header
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
