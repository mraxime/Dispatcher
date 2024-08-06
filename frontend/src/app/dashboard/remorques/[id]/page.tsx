'use client';

import { Box, Container } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import PageLoading from 'src/components/base/PageLoading';
import TrailerForm, { type TrailerSubmitData } from 'src/components/trailers/TrailerForm';
import { useTrailer } from 'src/hooks/useTrailers';
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
	{ name: 'Modifier' },
];

const TrailerPage = ({ params }: { params: { id: number } }) => {
	const trailer = useTrailer(params.id);
	if (!trailer.data) return <PageLoading />;

	const handleSubmit = async (data: TrailerSubmitData) => {
		await trailer.update(data);
	};

	return (
		<Container maxWidth="xl">
			<Header
				title={trailer.data.name}
				icon={<Icons.trailer />}
				iconHref={ROUTES.TrailersPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				{/* @ts-expect-error - data.company is a number. */}
				<TrailerForm mode="update" defaultValues={trailer.data} onSubmit={handleSubmit} />
			</Box>
		</Container>
	);
};

export default TrailerPage;
