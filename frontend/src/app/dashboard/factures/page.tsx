import Link from 'next/link';
import { Button, Container, SvgIcon } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { billParamsSchema } from 'src/lib/schemas/bill.schema';
import type { BillParams } from 'src/lib/types/directus';
import { deepMerge } from 'src/lib/utils';
import { getBills } from 'src/server/actions/bill.action';
import BillsPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Factures',
	},
];

const BillsPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const params = deepMerge<BillParams>(billParamsSchema.parseSearchParams(searchParams), {
		page: 1,
		limit: 10,
		fields: ['*', { call: ['*'], client: ['*', { company: ['*'] }], price: ['*'] }],
		filter: { status: { _eq: 'PAID' } },
		sort: '-date_created',
	});

	const bills = await getBills(params);

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
			<BillsPageView sx={{ mt: 4 }} bills={bills} params={params} />
		</Container>
	);
};

export default BillsPage;
