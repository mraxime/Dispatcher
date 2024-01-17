import Link from 'next/link';
import { Button, Container, SvgIcon } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { serviceParamsSchema } from 'src/lib/schemas/service.schema';
import { deepMerge } from 'src/lib/utils';
import { getServices } from 'src/server/actions/service.action';
import ServicesPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Services',
	},
];

const ServicesPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const params = deepMerge(serviceParamsSchema.parseSearchParams(searchParams), {
		page: 1,
		limit: 10,
		fields: ['*'],
		filter: { status: { _eq: 'ACTIVE' } },
		sort: '-date_created',
	});

	const services = await getServices(params);

	return (
		<Container maxWidth="xl">
			<PageHeader
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
			<ServicesPageView sx={{ mt: 4 }} services={services} params={params} />
		</Container>
	);
};

export default ServicesPage;
