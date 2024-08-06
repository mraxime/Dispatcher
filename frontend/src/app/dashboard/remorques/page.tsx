'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, SvgIcon } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import TrailersTable from 'src/components/trailers/TrailersTable';
import { useTrailers } from 'src/hooks/useTrailers';
import { ROUTES } from 'src/lib/constants/routes';
import type { TrailerParams } from 'src/lib/types/directus';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Remorques' },
];

const TrailersPage = () => {
	const params: TrailerParams = {
		page: 1,
		limit: 10,
		fields: ['*'],
		filter: { in_service: { _eq: true } },
		sort: '-date_created',
	};

	const trailers = useTrailers(params);
	const router = useRouter();

	return (
		<Container maxWidth="xl">
			<Header
				title="Liste des remorques"
				icon={<Icons.trailer />}
				breadcrumbItems={breadcrumbs}
				actionElement={
					<Button
						href={ROUTES.NewTrailerPage()}
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
				<TrailersTable
					data={trailers.data}
					params={trailers.params}
					isLoading={trailers.isLoading}
					onRefresh={trailers.revalidate}
					onParamsChange={trailers.setParams}
					onEdit={(id) => router.push(ROUTES.TrailerPage(id))}
					onDelete={trailers.delete}
				/>
			</Box>
		</Container>
	);
};

export default TrailersPage;
