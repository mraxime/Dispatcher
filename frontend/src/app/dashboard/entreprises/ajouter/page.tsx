'use client';

import { useRouter } from 'next/navigation';
import { Box, Container } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import PageLoading from 'src/components/base/PageLoading';
import CompanyForm from 'src/components/companies/CompanyForm';
import { useCompanies } from 'src/hooks/useCompanies';
import { usePermissions } from 'src/hooks/usePermissions';
import { useRoleByName } from 'src/hooks/useRoles';
import { ROUTES } from 'src/lib/constants/routes';
import type { CreateCompanySchema } from 'src/lib/schemas/companies';

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
	const companies = useCompanies();
	const superAdminRole = useRoleByName('Super Admin');
	const permissions = usePermissions();

	if (!superAdminRole.data || permissions.isLoading) return <PageLoading />;

	const permissionIds = permissions.data.map(({ id }) => id);

	const handleSubmit = async (data: CreateCompanySchema) => {
		// Admin data without id means it will be created
		const hasNewAdmin = !!data.admin && !data.admin.id;

		// modify data to set default role and permissions on the new admin
		if (hasNewAdmin) {
			data = {
				...data,
				admin: {
					...data.admin,
					role: superAdminRole.data.id,
					permissions: permissionIds,
				},
			};
		}

		await companies.create(data);
		router.push(ROUTES.CompaniesPage());
	};

	return (
		<Container maxWidth="xl">
			<Header
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
