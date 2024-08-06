'use client';

import { useRouter } from 'next/navigation';
import { Box, Container } from '@mui/material';
import Cookies from 'js-cookie';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import PageLoading from 'src/components/base/PageLoading';
import UserForm, { type UserSubmitData } from 'src/components/users/UserForm';
import { usePermissions } from 'src/hooks/usePermissions';
import { useRoles } from 'src/hooks/useRoles';
import { useUsers } from 'src/hooks/useUsers';
import { USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';

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

const NewEmployeePage = () => {
	const router = useRouter();
	const users = useUsers();

	const roles = useRoles({ fields: ['*'], sort: 'name', filter: { name: { _in: USER_ROLES } } });
	const permissions = usePermissions({ fields: ['*'], sort: 'group' });

	if (roles.isLoading || permissions.isLoading) return <PageLoading />;

	const companyCookie = Cookies.get('company');

	const handleSubmit = async (data: UserSubmitData) => {
		await users.create(data);
		router.push(ROUTES.EmployeesPage());
	};

	return (
		<Container maxWidth="xl">
			<Header
				title="Créer un employé"
				icon={<Icons.user />}
				iconHref={ROUTES.EmployeesPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<UserForm
					mode="create"
					defaultValues={{ company: Number(companyCookie) }}
					// @ts-expect-error - anoying typescript :)
					roles={roles.data}
					permissions={permissions.data}
					onSubmit={handleSubmit}
				/>
			</Box>
		</Container>
	);
};

export default NewEmployeePage;
