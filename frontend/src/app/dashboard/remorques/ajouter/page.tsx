import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { getCompanies } from 'src/server/actions/company.action';
import NewTrailerPageView from './view';

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

const NewTrailerPage = async () => {
	const companies = await getCompanies();

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Créer une remorque"
				icon={<Icons.trailer />}
				iconHref={ROUTES.TrailersPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<NewTrailerPageView sx={{ mt: 4 }} companies={companies} />
		</Container>
	);
};

export default NewTrailerPage;
