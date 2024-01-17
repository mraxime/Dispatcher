import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { getCompany } from 'src/server/actions/company.action';
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
	const company = await getCompany(params.id, { fields: ['*', { admin: ['*'] }] });

	return (
		<Container maxWidth="xl">
			<PageHeader
				title={company.name}
				icon={<Icons.company />}
				iconHref={ROUTES.CompaniesPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<CompanyPageView sx={{ mt: 4 }} company={company} />
		</Container>
	);
};

export default CompanyPage;
