import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import { getPermissions, getRoles } from 'src/server/actions/user.action';
import NewEmployeePageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Employés',
		href: ROUTES.EmployeesPage(),
	},
	{ name: 'Ajouter' },
];

const NewEmployeePage = async () => {
	const [roles, permissions] = await Promise.all([
		getRoles({ fields: ['*'], sort: 'name', filter: { name: { _in: USER_ROLES } } }),
		getPermissions({ fields: ['*'], sort: 'group' }),
	]);

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Créer un employé"
				icon={<Icons.user />}
				iconHref={ROUTES.EmployeesPage()}
				breadcrumbItems={breadcrumbs}
			/>
			<NewEmployeePageView sx={{ mt: 4 }} roles={roles} permissions={permissions} />
		</Container>
	);
};

export default NewEmployeePage;
