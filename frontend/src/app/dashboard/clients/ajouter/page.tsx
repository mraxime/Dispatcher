'use client';

import { useRouter } from 'next/navigation';
import { Box, Container } from '@mui/material';
import Cookies from 'js-cookie';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import ClientForm, { type ClientSubmitData } from 'src/components/clients/ClientForm';
import { useClientActions } from 'src/hooks/useClients';
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
	{ name: 'Ajouter' },
];

const NewClientPage = () => {
	const router = useRouter();
	const clientActions = useClientActions();

	const companyCookie = Cookies.get('company');

	const handleSubmit = async (data: ClientSubmitData) => {
		await clientActions.create(data);
		router.push(ROUTES.ClientsPage());
	};

	return (
		<Container maxWidth="md">
			<PageHeader
				title="Créer un client"
				icon={<Icons.client />}
				iconHref={ROUTES.ClientsPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<ClientForm
					mode="create"
					defaultValues={{ company: Number(companyCookie) }}
					onSubmit={handleSubmit}
				/>
			</Box>
		</Container>
	);
};

export default NewClientPage;
