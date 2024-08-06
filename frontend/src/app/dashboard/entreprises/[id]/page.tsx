'use client';

import { Box, Container } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import PageLoading from 'src/components/base/PageLoading';
import CompanyForm, { type CompanySubmitData } from 'src/components/companies/CompanyForm';
import { useSession } from 'src/contexts/session-context';
import { useCompany } from 'src/hooks/useCompanies';
import { usePermissions } from 'src/hooks/usePermissions';
import { useRoleByName } from 'src/hooks/useRoles';
import { ROUTES } from 'src/lib/constants/routes';

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

const CompanyPage = ({ params }: { params: { id: number } }) => {
	const session = useSession();
	const company = useCompany(params.id, { fields: ['*', { admin: ['*'] }] });
	const superAdminRole = useRoleByName('Super Admin');
	const permissions = usePermissions();

	if (!company.data || !superAdminRole.data || permissions.isLoading) return <PageLoading />;

	const permissionIds = permissions.data.map(({ id }) => id);

	const handleSubmit = async (data: CompanySubmitData) => {
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

		await company.update(data);
		if (data.admin && data.admin.id === session.data.id) await session.revalidate();
	};

	return (
		<Container maxWidth="xl">
			<Header
				title={company.data.name}
				icon={<Icons.company />}
				iconHref={ROUTES.CompaniesPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<CompanyForm
					mode="update"
					/* @ts-expect-error - data.company is a number. */
					defaultValues={company.data}
					onSubmit={handleSubmit}
				/>
			</Box>
		</Container>
	);
};

export default CompanyPage;
