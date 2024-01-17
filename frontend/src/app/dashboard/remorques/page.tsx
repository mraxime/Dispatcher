import Link from 'next/link';
import { Button, Container, SvgIcon } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { trailerParamsSchema } from 'src/lib/schemas/trailer.schema';
import type { TrailerParams } from 'src/lib/types/directus';
import { deepMerge } from 'src/lib/utils';
import { getTrailers } from 'src/server/actions/trailer.action';
import TrailersPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Remorques' },
];

const TrailersPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const params = deepMerge<TrailerParams>(trailerParamsSchema.parseSearchParams(searchParams), {
		page: 1,
		limit: 10,
		fields: ['*'],
		filter: { in_service: { _eq: true } },
		sort: '-date_created',
	});

	const trailers = await getTrailers(params);

	return (
		<Container maxWidth="xl">
			<PageHeader
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
			<TrailersPageView sx={{ mt: 4 }} trailers={trailers} params={params} />
		</Container>
	);
};

export default TrailersPage;
