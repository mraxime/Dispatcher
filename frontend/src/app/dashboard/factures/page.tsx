import Link from 'next/link';
import { Box, Button, Container, SvgIcon } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import BillsTable from 'src/components/bill/BillsTable';
import { ROUTES } from 'src/constants/routes';
import { getBills } from 'src/server/services';
import { billParamsSchema } from 'src/validations/bill';
import { pageGuard } from '../guard';

const BillsPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const session = await pageGuard('bills:read');

	// const params = {
	// 	fields: ['*', { call: ['*'], client: ['*', { company: ['*'] }], price: ['*'] }],
	// };
	const params = billParamsSchema.parse(searchParams);
	const bills = await getBills(params);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Factures',
		},
	];

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Liste des factures"
				icon={<Icons.bill />}
				breadcrumbItems={breadcrumbs}
				actionElement={
					<Button
						href={ROUTES.NewBillPage()}
						LinkComponent={Link}
						variant="contained"
						startIcon={
							<SvgIcon fontSize="small">
								<Icons.add />
							</SvgIcon>
						}
					>
						Ajouter
					</Button>
				}
			/>

			<Box mt={4}>
				<BillsTable data={bills} params={params} />
			</Box>
		</Container>
	);
};

export default BillsPage;
