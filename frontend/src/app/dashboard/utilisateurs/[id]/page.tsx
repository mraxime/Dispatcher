import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import UserForm from 'src/components/user/UserForm';
import { ROUTES } from 'src/constants/routes';
import { getAllPermissions, getCompanies, getUser, getUserPermissions } from 'src/server/services';
import { pageGuard } from '../../guard';

const UserPage = async ({ params }: { params: { id: string } }) => {
	const session = await pageGuard('users:read');

	const [companies, user, allPermissions] = await Promise.all([
		getCompanies(),
		getUser(params.id, { contacts: true, driverLicenses: true }),
		getAllPermissions(),
	]);

	if (!user) throw new Error('User not found');

	const userPermissions = await getUserPermissions(user.id);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Utilisateurs',
			href: ROUTES.UsersPage(),
		},
		{ name: 'Modifier' },
	];

	return (
		<Container maxWidth="xl">
			<PageHeader
				title={`${user.firstName} ${user.lastName}`}
				icon={<Icons.user />}
				iconHref={ROUTES.UsersPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<UserForm
					id={user.id}
					defaultValues={{
						...user,
						permissions: userPermissions.map((permission) => permission.id),
					}}
					companies={companies}
					permissions={allPermissions}
				/>
			</Box>
		</Container>
	);
};

export default UserPage;
