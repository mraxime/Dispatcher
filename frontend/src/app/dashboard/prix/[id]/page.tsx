import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import PriceForm from 'src/components/price/PriceForm';
import { ROUTES } from 'src/constants/routes';
import { getPrice } from 'src/server/services';
import { pageGuard } from '../../guard';

const PricePage = async ({ params }: { params: { id: string } }) => {
	const session = await pageGuard('prices:read');
	const price = await getPrice(params.id);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Prix',
			href: ROUTES.PricesPage(),
		},
		{ name: 'Modifier' },
	];

	return (
		<Container maxWidth="md">
			<PageHeader
				title={price.name}
				icon={<Icons.price />}
				iconHref={ROUTES.PricesPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<Box mt={4}>
				<PriceForm id={price.id} defaultValues={price} />
			</Box>
		</Container>
	);
};

export default PricePage;
