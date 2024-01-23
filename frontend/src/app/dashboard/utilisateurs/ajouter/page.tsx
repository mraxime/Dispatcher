import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import { getCompanies } from 'src/server/actions/company.action';
import { getPermissions, getRoles } from 'src/server/actions/user.action';
import NewUserPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Utilisateurs',
		href: ROUTES.UsersPage(),
	},
	{ name: 'Ajouter' },
];

const NewUserPage = async () => {
	const [companies, roles, permissions] = await Promise.all([
		getCompanies(),
		getRoles({ fields: ['*'], sort: 'name', filter: { name: { _in: USER_ROLES } } }),
		getPermissions({ fields: ['*'], sort: 'group' }),
	]);

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Créer un utilisateur"
				icon={<Icons.user />}
				iconHref={ROUTES.UsersPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<NewUserPageView
				sx={{ mt: 4 }}
				companies={companies}
				roles={roles}
				permissions={permissions}
			/>
		</Container>
	);
};

export default NewUserPage;
