import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import CompanyForm from 'src/components/company/CompanyForm';
import { ROUTES } from 'src/constants/routes';
import { getCompanies, getCompany } from 'src/server/services';
import { pageGuard } from '../../guard';

const CompanyPage = async ({ params }: { params: { id: string } }) => {
	const session = await pageGuard('companies:read');
	const [company, companies] = await Promise.all([getCompany(params.id), getCompanies()]);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Entreprises',
			href: ROUTES.CompaniesPage(),
		},
		{ name: 'Modifier' },
	];

	return (
		<Container maxWidth="md">
			<PageHeader
				title={company.name}
				icon={<Icons.company />}
				iconHref={ROUTES.CompaniesPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<CompanyForm id={company.id} companies={companies} defaultValues={company} />
			</Box>
		</Container>
	);
};

export default CompanyPage;
