import Link from 'next/link';
import { Button, Container, SvgIcon } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { priceParamsSchema } from 'src/lib/schemas/price.schema';
import type { PriceParams } from 'src/lib/types/directus';
import { deepMerge } from 'src/lib/utils';
import { getPrices } from 'src/server/actions/price.action';
import PricesPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Prix',
	},
];

const PricesPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const params = deepMerge<PriceParams>(priceParamsSchema.parseSearchParams(searchParams), {
		page: 1,
		limit: 10,
		fields: ['*'],
		filter: { status: { _eq: 'ACTIVE' } },
		sort: '-date_created',
	});

	const prices = await getPrices(params);

	return (
		<Container maxWidth="xl">
			<PageHeader
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
			<PricesPageView sx={{ mt: 4 }} prices={prices} params={params} />
		</Container>
	);
};

export default PricesPage;
