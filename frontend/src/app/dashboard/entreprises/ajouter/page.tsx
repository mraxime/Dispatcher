import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { getCompanies } from 'src/server/actions/company.action';
import NewCompanyPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Entreprises',
		href: ROUTES.CompaniesPage(),
	},
	{ name: 'Ajouter' },
];

const NewCompanyPage = async () => {
	const companies = await getCompanies();

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Créer une entreprise"
				icon={<Icons.company />}
				iconHref={ROUTES.CompaniesPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<NewCompanyPageView sx={{ mt: 4 }} companies={companies} />
		</Container>
	);
};

export default NewCompanyPage;
