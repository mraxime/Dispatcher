'use client';

import { useRouter } from 'next/navigation';
import { Box, Container } from '@mui/material';
import Cookies from 'js-cookie';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import TrailerForm, { type TrailerSubmitData } from 'src/components/trailers/TrailerForm';
import { useTrailerActions } from 'src/hooks/useTrailers';
import { ROUTES } from 'src/lib/constants/routes';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Remorques',
		href: ROUTES.TrailersPage(),
	},
	{ name: 'Ajouter' },
];

const NewTrailerPage = () => {
	const router = useRouter();
	const trailerActions = useTrailerActions();
	const companyCookie = Cookies.get('company');

	const handleSubmit = async (data: TrailerSubmitData) => {
		await trailerActions.create(data);
		router.push(ROUTES.TrailersPage());
	};

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Créer une remorque"
				icon={<Icons.trailer />}
				iconHref={ROUTES.TrailersPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<Box mt={4}>
				<TrailerForm
					mode="create"
					defaultValues={{ company: Number(companyCookie) }}
					onSubmit={handleSubmit}
				/>
			</Box>
		</Container>
	);
};

export default NewTrailerPage;
