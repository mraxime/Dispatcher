import Link from 'next/link';
import { Box, Button, Container, SvgIcon } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import PricesTable from 'src/components/price/PricesTable';
import { ROUTES } from 'src/constants/routes';
import { getPrices } from 'src/server/services';
import { priceParamsSchema } from 'src/validations/price';
import { pageGuard } from '../guard';

const PricesPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const session = await pageGuard('prices:read');
	const params = priceParamsSchema.parse(searchParams);
	const prices = await getPrices(params);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Prix',
		},
	];

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

			<Box mt={4}>
				<PricesTable data={prices} params={params} />
			</Box>
		</Container>
	);
};

export default PricesPage;
