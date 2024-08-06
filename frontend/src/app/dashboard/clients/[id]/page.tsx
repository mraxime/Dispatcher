'use client';

import { Box, Container } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import PageLoading from 'src/components/base/PageLoading';
import ClientForm, { type ClientSubmitData } from 'src/components/clients/ClientForm';
import { useClient } from 'src/hooks/useClients';
import { ROUTES } from 'src/lib/constants/routes';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Clients',
		href: ROUTES.ClientsPage(),
	},
	{ name: 'Modifier' },
];

const ClientPage = ({ params }: { params: { id: number } }) => {
	const client = useClient(params.id);
	if (!client.data) return <PageLoading />;

	const handleSubmit = async (data: ClientSubmitData) => {
		await client.update(data);
	};

	return (
		<Container maxWidth="md">
			<Header
				title={client.data.name}
				icon={<Icons.client />}
				iconHref={ROUTES.ClientsPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				{/* @ts-expect-error - data.company is a number. */}
				<ClientForm mode="update" defaultValues={client.data} onSubmit={handleSubmit} />
			</Box>
		</Container>
	);
};

export default ClientPage;
