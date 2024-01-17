import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { getTrailer } from 'src/server/actions/trailer.action';
import TrailerPageView from './view';

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

const TrailerPage = async ({ params }: { params: { id: string } }) => {
	const trailer = await getTrailer(Number(params.id));

	return (
		<Container maxWidth="xl">
			<PageHeader
				title={trailer.name}
				icon={<Icons.trailer />}
				iconHref={ROUTES.TrailersPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<TrailerPageView sx={{ mt: 4 }} trailer={trailer} />
		</Container>
	);
};

export default TrailerPage;
