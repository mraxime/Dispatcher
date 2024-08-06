'use client';

import { useRouter } from 'next/navigation';
import { Box, Container } from '@mui/material';
import Cookies from 'js-cookie';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import PageLoading from 'src/components/base/PageLoading';
import CallForm, { type CallSubmitData } from 'src/components/calls/CallForm';
import { useCalls } from 'src/hooks/useCalls';
import { useClients } from 'src/hooks/useClients';
import { useServices } from 'src/hooks/useServices';
import { useTrailers } from 'src/hooks/useTrailers';
import { useUsers } from 'src/hooks/useUsers';
import { ROUTES } from 'src/lib/constants/routes';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Appels', href: ROUTES.CallsPage() },
	{ name: 'Ajouter' },
];

const NewCallPage = () => {
	const router = useRouter();
	const calls = useCalls();
	const services = useServices();
	const trailers = useTrailers();
	const clients = useClients();
	const drivers = useUsers({
		filter: { role: { name: { _eq: 'Chauffeur' } } },
	});

	if (services.isLoading || trailers.isLoading || clients.isLoading || drivers.isLoading) {
		return <PageLoading />;
	}

	const companyCookie = Cookies.get('company');

	const handleSubmit = async (data: CallSubmitData) => {
		await calls.create(data);
		router.push(ROUTES.CallsPage());
	};

	return (
		<Container maxWidth="md">
			<Header
				title="Créer un formulaire d'appel"
				icon={<Icons.call />}
				iconHref={ROUTES.CallsPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<CallForm
					mode="create"
					defaultValues={{ company: Number(companyCookie) }}
					services={services.data}
					trailers={trailers.data}
					clients={clients.data}
					drivers={drivers.data}
					onSubmit={handleSubmit}
				/>
			</Box>
		</Container>
	);
};

export default NewCallPage;
