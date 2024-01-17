import Link from 'next/link';
import { Button, Container, SvgIcon } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { clientParamsSchema } from 'src/lib/schemas/client.schema';
import type { ClientParams } from 'src/lib/types/directus';
import { deepMerge } from 'src/lib/utils';
import { getClients } from 'src/server/actions/client.action';
import ClientsPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Clients' },
];

const ClientsPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const params = deepMerge<ClientParams>(clientParamsSchema.parseSearchParams(searchParams), {
		page: 1,
		limit: 10,
		fields: ['*'],
		filter: { status: { _eq: 'ACTIVE' } },
		sort: '-date_created',
	});

	const clients = await getClients(params);

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
			<ClientsPageView sx={{ mt: 4 }} clients={clients} params={params} />
		</Container>
	);
};

export default ClientsPage;
