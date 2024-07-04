import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import PriceForm from 'src/components/price/PriceForm';
import { ROUTES } from 'src/constants/routes';
import { pageGuard } from '../../guard';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Prix',
		href: ROUTES.PricesPage(),
	},
	{ name: 'Ajouter' },
];

const NewPricePage = async () => {
	const session = await pageGuard('prices:read');

	return (
		<Container maxWidth="md">
			<PageHeader
				title="Créer un prix"
				icon={<Icons.price />}
				iconHref={ROUTES.PricesPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<Box mt={4}>
				<PriceForm defaultValues={{ companyId: session.selectedCompany.id }} />
			</Box>
		</Container>
	);
};

export default NewPricePage;
