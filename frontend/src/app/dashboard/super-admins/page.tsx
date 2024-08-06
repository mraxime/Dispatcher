'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, SvgIcon } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import UsersTable from 'src/components/users/UsersTable';
import { useUsers } from 'src/hooks/useUsers';
import { SUPER_USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import type { UserParams } from 'src/lib/types/directus';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Super Admins' },
];

const SuperAdminsPage = () => {
	const params: UserParams = {
		page: 1,
		limit: 10,
		fields: ['*', { role: ['*'] }],
		filter: { role: { name: { _eq: 'Super Admin' } } },
		sort: ['role.name', '-date_created'],
	};

	const superAdmins = useUsers(params, false);
	const router = useRouter();

	return (
		<Container maxWidth="xl">
			<Header
				title="Liste des super admins"
				icon={<Icons.user />}
				breadcrumbItems={breadcrumbs}
				actionElement={
					<Button
						href={ROUTES.NewSuperAdminPage()}
						LinkComponent={Link}
						variant="contained"
						startIcon={
							<SvgIcon fontSize="small">
								<Icons.add />
							</SvgIcon>
						}
					>
						Ajouter
					</Button>
				}
			/>

			<Box mt={4}>
				<UsersTable
					data={superAdmins.data}
					params={superAdmins.params}
					basePath={ROUTES.SuperAdminsPage()}
					tabs={SUPER_USER_ROLES}
					isLoading={superAdmins.isLoading}
					onRefresh={superAdmins.revalidate}
					onParamsChange={superAdmins.setParams}
					onEdit={(id) => router.push(ROUTES.SuperAdminPage(id))}
					onDelete={superAdmins.delete}
				/>
			</Box>
		</Container>
	);
};

export default SuperAdminsPage;
