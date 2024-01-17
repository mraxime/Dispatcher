'use client';

import { useRouter } from 'next/navigation';
import { Box, Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import CompanyForm from 'src/components/companies/CompanyForm';
import { useCompanyActions } from 'src/hooks/useCompanies';
import { ROUTES } from 'src/lib/constants/routes';
import type { CreateCompanySchema } from 'src/lib/schemas/company.schema';

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

const NewCompanyPage = () => {
	const router = useRouter();
	const companyActions = useCompanyActions();

	const handleSubmit = async (data: CreateCompanySchema) => {
		await companyActions.create(data);
		router.push(ROUTES.CompaniesPage());
	};

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Créer une entreprise"
				icon={<Icons.company />}
				iconHref={ROUTES.CompaniesPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<CompanyForm mode="create" onSubmit={handleSubmit} />
			</Box>
		</Container>
	);
};

export default NewCompanyPage;
