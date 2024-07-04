import Link from 'next/link';
import { Box, Button, Container, SvgIcon } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import ServicesTable from 'src/components/service/ServicesTable';
import { ROUTES } from 'src/constants/routes';
import { getServices } from 'src/server/services';
import { serviceParamsSchema } from 'src/validations/service';
import { pageGuard } from '../guard';

const ServicesPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const session = await pageGuard('services:read');
	const params = serviceParamsSchema.parse(searchParams);
	const services = await getServices(params);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Services',
		},
	];

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

			<Box mt={4}>
				<ServicesTable data={services} params={params} />
			</Box>
		</Container>
	);
};

export default ServicesPage;
