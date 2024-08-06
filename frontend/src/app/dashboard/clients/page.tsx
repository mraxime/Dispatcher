'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, SvgIcon } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import ClientsTable from 'src/components/clients/ClientsTable';
import { useClients } from 'src/hooks/useClients';
import { ROUTES } from 'src/lib/constants/routes';
import type { ClientParams } from 'src/lib/types/directus';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Clients' },
];

const ClientsPage = () => {
	const params: ClientParams = {
		page: 1,
		limit: 10,
		fields: ['*'],
		filter: { status: { _eq: 'ACTIVE' } },
		sort: '-date_created',
	};

	const clients = useClients(params);
	const router = useRouter();

	return (
		<Container maxWidth="xl">
			<Header
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
				<ClientsTable
					data={clients.data}
					params={clients.params}
					isLoading={clients.isLoading}
					onRefresh={clients.revalidate}
					onParamsChange={clients.setParams}
					onEdit={(id) => router.push(ROUTES.ClientPage(id))}
					onDelete={clients.delete}
				/>
			</Box>
		</Container>
	);
};

export default ClientsPage;
