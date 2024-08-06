'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, SvgIcon } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import PricesTable from 'src/components/prices/PricesTable';
import { usePrices } from 'src/hooks/usePrices';
import { ROUTES } from 'src/lib/constants/routes';
import type { PriceParams } from 'src/lib/types/directus';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Prix',
	},
];

const PricesPage = () => {
	const params: PriceParams = {
		page: 1,
		limit: 10,
		fields: ['*'],
		filter: { status: { _eq: 'ACTIVE' } },
		sort: '-date_created',
	};

	const prices = usePrices(params);
	const router = useRouter();

	return (
		<Container maxWidth="xl">
			<Header
				title="Liste des prix"
				icon={<Icons.price />}
				breadcrumbItems={breadcrumbs}
				actionElement={
					<Button
						href={ROUTES.NewPricePage()}
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
				<PricesTable
					data={prices.data}
					params={prices.params}
					isLoading={prices.isLoading}
					onRefresh={prices.revalidate}
					onParamsChange={prices.setParams}
					onEdit={(id) => router.push(ROUTES.PricePage(id))}
					onDelete={prices.delete}
				/>
			</Box>
		</Container>
	);
};

export default PricesPage;
