import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import { getCompanies } from 'src/server/actions/company.action';
import { getPermissions, getRoles, getUser } from 'src/server/actions/user.action';
import UserPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Utilisateurs',
		href: ROUTES.UsersPage(),
	},
	{ name: 'Modifier' },
];

const UserPage = async ({ params }: { params: { id: string } }) => {
	const [companies, user, roles, permissions] = await Promise.all([
		getCompanies(),
		getUser(params.id, {
			fields: [
				'*',
				{
					driver_license: ['*'],
					emergency_contact: ['*'],
					permissions: ['custom_permissions_id'],
				},
			],
		}),
		getRoles({ fields: ['*'], sort: 'name', filter: { name: { _in: USER_ROLES } } }),
		getPermissions({ fields: ['*'], sort: 'group' }),
	]);

	return (
		<Container maxWidth="xl">
			<PageHeader
				title={`${user.first_name} ${user.last_name}`}
				icon={<Icons.user />}
				iconHref={ROUTES.UsersPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<UserPageView
				sx={{ mt: 4 }}
				user={user}
				companies={companies}
				roles={roles}
				permissions={permissions}
			/>
		</Container>
	);
};

export default UserPage;
