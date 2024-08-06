'use client';

import { useRouter } from 'next/navigation';
import { Box, Container } from '@mui/material';
import Cookies from 'js-cookie';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import PageLoading from 'src/components/base/PageLoading';
import ServiceForm, { type ServiceSubmitData } from 'src/components/services/ServiceForm';
import { usePrices } from 'src/hooks/usePrices';
import { useServices } from 'src/hooks/useServices';
import { ROUTES } from 'src/lib/constants/routes';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Services',
		href: ROUTES.ServicesPage(),
	},
	{ name: 'Ajouter' },
];

const NewServicePage = () => {
	const router = useRouter();
	const services = useServices();
	const prices = usePrices();

	if (prices.isLoading) return <PageLoading />;

	const companyCookie = Cookies.get('company');

	const handleSubmit = async (data: ServiceSubmitData) => {
		await services.create(data);
		router.push(ROUTES.ServicesPage());
	};

	return (
		<Container maxWidth="md">
			<Header
				title="Créer un service"
				icon={<Icons.service />}
				iconHref={ROUTES.ServicesPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<ServiceForm
					mode="create"
					defaultValues={{ company: Number(companyCookie) }}
					prices={prices.data}
					onSubmit={handleSubmit}
				/>
			</Box>
		</Container>
	);
};

export default NewServicePage;
