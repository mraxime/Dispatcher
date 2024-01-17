import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { getPrice } from 'src/server/actions/price.action';
import PricePageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Prix',
		href: ROUTES.PricesPage(),
	},
	{ name: 'Modifier' },
];

const PricePage = async ({ params }: { params: { id: string } }) => {
	const price = await getPrice(Number(params.id), { fields: ['*', { conditions: ['*'] }] });

	return (
		<Container maxWidth="md">
			<PageHeader
				title={price.name}
				icon={<Icons.price />}
				iconHref={ROUTES.PricesPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<PricePageView sx={{ mt: 4 }} price={price} />
		</Container>
	);
};

export default PricePage;
