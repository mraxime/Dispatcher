import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import CompanyForm from 'src/components/company/CompanyForm';
import { ROUTES } from 'src/constants/routes';
import { getCompanies } from 'src/server/services';
import { pageGuard } from '../../guard';

const NewCompanyPage = async () => {
	const session = await pageGuard('companies:read', 'companies:create');
	const companies = await getCompanies();

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Entreprises',
			href: ROUTES.CompaniesPage(),
		},
		{ name: 'Ajouter' },
	];

	return (
		<Container maxWidth="md">
			<PageHeader
				title="Créer une entreprise"
				icon={<Icons.company />}
				iconHref={ROUTES.CompaniesPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<CompanyForm
					companies={companies}
					defaultValues={{
						parentCompanyId: session.user.selectedCompanyId,
					}}
				/>
			</Box>
		</Container>
	);
};

export default NewCompanyPage;
