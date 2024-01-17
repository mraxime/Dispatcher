import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { SUPER_USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import { getPermissions, getRoles } from 'src/server/actions/user.action';
import NewSuperAdminPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Super Admins',
		href: ROUTES.SuperAdminsPage(),
	},
	{ name: 'Ajouter' },
];

const NewSuperAdminPage = async () => {
	const roles = await getRoles({ fields: ['*'], filter: { name: { _eq: SUPER_USER_ROLES[0] } } });
	const permissions = await getPermissions({ fields: ['*'], sort: 'group' });

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Créer un super admin"
				icon={<Icons.user />}
				iconHref={ROUTES.SuperAdminsPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<NewSuperAdminPageView sx={{ mt: 4 }} roles={roles} permissions={permissions} />
		</Container>
	);
};

export default NewSuperAdminPage;
