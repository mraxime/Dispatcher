import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { SUPER_USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import { getPermissions, getRoles, getUser } from 'src/server/actions/user.action';
import SuperAdminPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Super Admins',
		href: ROUTES.SuperAdminsPage(),
	},
	{ name: 'Modifier' },
];

const SuperAdminPage = async ({ params }: { params: { id: string } }) => {
	const [superAdmin, roles, permissions] = await Promise.all([
		getUser(
			params.id,
			{
				fields: [
					'*',
					{
						driver_license: ['*'],
						emergency_contact: ['*'],
						permissions: ['custom_permissions_id'],
					},
				],
			},
			false,
		),
		getRoles({ fields: ['*'], filter: { name: { _eq: SUPER_USER_ROLES[0] } } }),
		getPermissions({ fields: ['*'], sort: 'group' }),
	]);

	return (
		<Container maxWidth="xl">
			<PageHeader
				title={`${superAdmin.first_name} ${superAdmin.last_name}`}
				icon={<Icons.user />}
				iconHref={ROUTES.SuperAdminsPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<SuperAdminPageView
				sx={{ mt: 4 }}
				superAdmin={superAdmin}
				roles={roles}
				permissions={permissions}
			/>
			;
		</Container>
	);
};

export default SuperAdminPage;
