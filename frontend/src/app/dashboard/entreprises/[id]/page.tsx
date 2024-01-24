import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { getCompanies, getCompany } from 'src/server/actions/company.action';
import CompanyPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Entreprises',
		href: ROUTES.CompaniesPage(),
	},
	{ name: 'Modifier' },
];

const CompanyPage = async ({ params }: { params: { id: number } }) => {
	const [company, companies] = await Promise.all([
		getCompany(params.id, { fields: ['*', { admin: ['*'] }] }),
		getCompanies(),
	]);

	return (
		<Container maxWidth="xl">
			<PageHeader
				title={company.name}
				icon={<Icons.company />}
				iconHref={ROUTES.CompaniesPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<CompanyPageView sx={{ mt: 4 }} company={company} companies={companies} />
		</Container>
	);
};

export default CompanyPage;
