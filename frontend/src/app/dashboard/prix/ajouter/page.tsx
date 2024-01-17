'use client';

import { useRouter } from 'next/navigation';
import { Box, Container } from '@mui/material';
import Cookies from 'js-cookie';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import PriceForm, { type PriceSubmitData } from 'src/components/prices/PriceForm';
import { usePriceActions } from 'src/hooks/usePrices';
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
	{ name: 'Ajouter' },
];

const NewPricePage = () => {
	const router = useRouter();
	const priceActions = usePriceActions();
	const companyCookie = Cookies.get('company');

	const handleSubmit = async (data: PriceSubmitData) => {
		await priceActions.create(data);
		router.push(ROUTES.PricesPage());
	};

	return (
		<Container maxWidth="md">
			<PageHeader
				title="Créer un prix"
				icon={<Icons.price />}
				iconHref={ROUTES.PricesPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<Box mt={4}>
				<PriceForm
					mode="create"
					defaultValues={{ company: Number(companyCookie) }}
					onSubmit={handleSubmit}
				/>
			</Box>
		</Container>
	);
};

export default NewPricePage;
