'use client';

import { Box, Container } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import PageLoading from 'src/components/base/PageLoading';
import PriceForm, { type PriceSubmitData } from 'src/components/prices/PriceForm';
import { usePrice } from 'src/hooks/usePrices';
import { ROUTES } from 'src/lib/constants/routes';

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

const PricePage = ({ params }: { params: { id: number } }) => {
	const price = usePrice(params.id, { fields: ['*', { conditions: ['*'] }] });
	if (!price.data) return <PageLoading />;

	const handleSubmit = async (data: PriceSubmitData) => {
		await price.update(data);
	};

	return (
		<Container maxWidth="md">
			<Header
				title={price.data.name}
				icon={<Icons.price />}
				iconHref={ROUTES.PricesPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				{/* @ts-expect-error - data.company is a number. */}
				<PriceForm mode="update" defaultValues={price.data} onSubmit={handleSubmit} />
			</Box>
		</Container>
	);
};

export default PricePage;
