import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import { getPermissions, getRoles, getUser } from 'src/server/actions/user.action';
import EmployeePageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Employés',
		href: ROUTES.EmployeesPage(),
	},
	{ name: 'Modifier' },
];

const EmployeePage = async ({ params }: { params: { id: string } }) => {
	const [employee, roles, permissions] = await Promise.all([
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
				title={`${employee.first_name} ${employee.last_name}`}
				icon={<Icons.user />}
				iconHref={ROUTES.EmployeesPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<EmployeePageView
				sx={{ mt: 4 }}
				employee={employee}
				roles={roles}
				permissions={permissions}
			/>
		</Container>
	);
};

export default EmployeePage;
