import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import Maintenance from 'src/components/base/Maintenance';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/constants/routes';
import { getBill } from 'src/server/services';
import { pageGuard } from '../../guard';

const BillPage = async ({ params }: { params: { id: string } }) => {
	const session = await pageGuard('bills:read');
	const bill = await getBill(params.id);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Factures',
			href: ROUTES.BillsPage(),
		},
		{ name: 'Modifier' },
	];

	return (
		<Container maxWidth="xl">
			<PageHeader
				title={`Facture #${bill.id}`}
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

export default BillPage;
