'use client';

import { useRouter } from 'next/navigation';
import { Box, Container } from '@mui/material';
import Cookies from 'js-cookie';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import TrailerForm, { type TrailerSubmitData } from 'src/components/trailers/TrailerForm';
import { useTrailers } from 'src/hooks/useTrailers';
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
	const trailers = useTrailers();
	const companyCookie = Cookies.get('company');

	const handleSubmit = async (data: TrailerSubmitData) => {
		await trailers.create(data);
		router.push(ROUTES.TrailersPage());
	};

	return (
		<Container maxWidth="xl">
			<Header
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
