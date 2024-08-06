'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, SvgIcon } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import BillsTable from 'src/components/bills/BillsTable';
import { useBills } from 'src/hooks/useBills';
import { ROUTES } from 'src/lib/constants/routes';
import type { BillParams } from 'src/lib/types/directus';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Factures',
	},
];

const BillsPage = () => {
	const params: BillParams = {
		page: 1,
		limit: 10,
		fields: ['*', { call: ['*'], client: ['*', { company: ['*'] }], price: ['*'] }],
		filter: { status: { _eq: 'PAID' } },
		sort: '-date_created',
	};

	const bills = useBills(params);
	const router = useRouter();

	return (
		<Container maxWidth="xl">
			<Header
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
				<BillsTable
					data={bills.data}
					params={bills.params}
					isLoading={bills.isLoading}
					onRefresh={bills.revalidate}
					onParamsChange={bills.setParams}
					onEdit={(id) => router.push(ROUTES.BillPage(id))}
					onDelete={bills.delete}
				/>
			</Box>
		</Container>
	);
};

export default BillsPage;
