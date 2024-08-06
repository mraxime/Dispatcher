'use client';

import { Box, Container } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import PageLoading from 'src/components/base/PageLoading';
import UserForm, { type UserSubmitData } from 'src/components/users/UserForm';
import { useSession } from 'src/contexts/session-context';
import { usePermissions } from 'src/hooks/usePermissions';
import { useRoles } from 'src/hooks/useRoles';
import { useUser } from 'src/hooks/useUsers';
import { SUPER_USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import type { JunctionUserCustomPermission } from 'src/lib/types/directus';

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

const SuperAdminPage = ({ params }: { params: { id: string } }) => {
	const session = useSession();
	const superAdmin = useUser(
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
	);

	const roles = useRoles({ fields: ['*'], filter: { name: { _eq: SUPER_USER_ROLES[0] } } });
	const permissions = usePermissions({ fields: ['*'], sort: 'group' });

	if (!superAdmin.data || roles.isLoading || permissions.isLoading) return <PageLoading />;

	const handleSubmit = async (data: UserSubmitData) => {
		await superAdmin.update(data);
		if (data.email === session.data.email) await session.revalidate();
	};

	// Get the actual permission ids from the junctions
	const permissionIds = (superAdmin.data.permissions as JunctionUserCustomPermission[]).map(
		({ custom_permissions_id }) => custom_permissions_id as number,
	);

	return (
		<Container maxWidth="xl">
			<Header
				title={`${superAdmin.data.first_name} ${superAdmin.data.last_name}`}
				icon={<Icons.user />}
				iconHref={ROUTES.SuperAdminsPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<UserForm
					mode="update"
					// @ts-expect-error - anoying typescript :)
					defaultValues={{ ...superAdmin.data, permissions: permissionIds }}
					// @ts-expect-error - anoying typescript :)
					roles={roles.data}
					permissions={permissions.data}
					onSubmit={handleSubmit}
				/>
			</Box>
		</Container>
	);
};

export default SuperAdminPage;
