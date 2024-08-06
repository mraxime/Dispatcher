'use client';

import { Box, Container } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import PageLoading from 'src/components/base/PageLoading';
import ServiceForm, { type ServiceSubmitData } from 'src/components/services/ServiceForm';
import { usePrices } from 'src/hooks/usePrices';
import { useService } from 'src/hooks/useServices';
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
	{ name: 'Modifier' },
];

const ServicePage = ({ params }: { params: { id: number } }) => {
	const service = useService(params.id);
	const prices = usePrices();

	if (!service.data || prices.isLoading) return <PageLoading />;

	const handleSubmit = async (data: ServiceSubmitData) => {
		await service.update(data);
	};

	return (
		<Container maxWidth="md">
			<Header
				title={service.data.name}
				icon={<Icons.service />}
				iconHref={ROUTES.ServicesPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<ServiceForm
					mode="update"
					/* @ts-expect-error - data.company is a number. */
					defaultValues={service.data}
					prices={prices.data}
					onSubmit={handleSubmit}
				/>
			</Box>
		</Container>
	);
};

export default ServicePage;
