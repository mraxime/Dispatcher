'use client';

import { Box, Container } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import PageLoading from 'src/components/base/PageLoading';
import { useBill } from 'src/hooks/useBills';
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
	{ name: 'Modifier' },
];

const BillPage = ({ params }: { params: { id: number } }) => {
	const bill = useBill(params.id);
	if (!bill.data) return <PageLoading />;

	return (
		<Container maxWidth="xl">
			<Header
				title={`Facture #${bill.data.id}`}
				icon={<Icons.bill />}
				iconHref={ROUTES.BillsPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>En développement...</Box>
		</Container>
	);
};

export default BillPage;
