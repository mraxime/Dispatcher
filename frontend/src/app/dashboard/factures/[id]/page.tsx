import { Box, Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { getBill } from 'src/server/actions/bill.action';

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

const BillPage = async ({ params }: { params: { id: string } }) => {
	const bill = await getBill(Number(params.id));

	return (
		<Container maxWidth="xl">
			<PageHeader
				title={`Facture #${bill.id}`}
				icon={<Icons.bill />}
				iconHref={ROUTES.BillsPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<Box mt={4}>En développement...</Box>
		</Container>
	);
};

export default BillPage;
