import Link from 'next/link';
import { Box, Button, Container, SvgIcon } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import ClientsTable from 'src/components/client/ClientsTable';
import { ROUTES } from 'src/constants/routes';
import { getClients } from 'src/server/services';
import { clientParamsSchema } from 'src/validations/client';
import { pageGuard } from '../guard';

const ClientsPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const session = await pageGuard('clients:read');
	const params = clientParamsSchema.parse(searchParams);
	const clients = await getClients(params);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{ name: 'Clients' },
	];

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Liste des clients"
				icon={<Icons.client />}
				breadcrumbItems={breadcrumbs}
				actionElement={
					<Button
						href={ROUTES.NewClientPage()}
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
				<ClientsTable data={clients} params={params} />
			</Box>
		</Container>
	);
};

export default ClientsPage;
