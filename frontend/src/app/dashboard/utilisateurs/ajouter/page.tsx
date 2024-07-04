import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import UserForm from 'src/components/user/UserForm';
import { ROUTES } from 'src/constants/routes';
import { getAllPermissions, getCompanies } from 'src/server/services';
import { pageGuard } from '../../guard';

const NewUserPage = async () => {
	const session = await pageGuard('users:read', 'users:create');
	const [companies, permissions] = await Promise.all([getCompanies(), getAllPermissions()]);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Utilisateurs',
			href: ROUTES.UsersPage(),
		},
		{ name: 'Ajouter' },
	];

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Créer un utilisateur"
				icon={<Icons.user />}
				iconHref={ROUTES.UsersPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<UserForm
					defaultValues={{ companyId: session.user.selectedCompanyId }}
					companies={companies}
					permissions={permissions}
				/>
			</Box>
		</Container>
	);
};

export default NewUserPage;
