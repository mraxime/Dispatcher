'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, SvgIcon } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import ServicesTable from 'src/components/services/ServicesTable';
import { useServices } from 'src/hooks/useServices';
import { ROUTES } from 'src/lib/constants/routes';
import type { ServiceParams } from 'src/lib/types/directus';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Services',
	},
];

const ServicesPage = () => {
	const params: ServiceParams = {
		page: 1,
		limit: 10,
		fields: ['*'],
		filter: { status: { _eq: 'ACTIVE' } },
		sort: '-date_created',
	};

	const services = useServices(params);
	const router = useRouter();

	return (
		<Container maxWidth="xl">
			<Header
				title="Liste des services"
				icon={<Icons.service />}
				breadcrumbItems={breadcrumbs}
				actionElement={
					<Button
						href={ROUTES.NewServicePage()}
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
				<ServicesTable
					data={services.data}
					params={services.params}
					isLoading={services.isLoading}
					onRefresh={services.revalidate}
					onParamsChange={services.setParams}
					onEdit={(id) => router.push(ROUTES.ServicePage(id))}
					onDelete={services.delete}
				/>
			</Box>
		</Container>
	);
};

export default ServicesPage;
