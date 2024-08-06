'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, SvgIcon } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import UsersTable from 'src/components/users/UsersTable';
import { useUsers } from 'src/hooks/useUsers';
import { USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import type { UserParams } from 'src/lib/types/directus';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Employés' },
];

const EmployeesPage = () => {
	const params: UserParams = {
		page: 1,
		limit: 10,
		fields: ['*', { role: ['*'] }],
		filter: { role: { name: { _in: USER_ROLES } } },
		sort: ['role.name', '-date_created'],
	};

	const employees = useUsers(params);
	const router = useRouter();

	return (
		<Container maxWidth="xl">
			<Header
				title="Liste des employés"
				icon={<Icons.user />}
				breadcrumbItems={breadcrumbs}
				actionElement={
					<Button
						href={ROUTES.NewEmployeePage()}
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
					data={employees.data}
					params={employees.params}
					isLoading={employees.isLoading}
					onRefresh={employees.revalidate}
					onParamsChange={employees.setParams}
					onEdit={(id) => router.push(ROUTES.EmployeePage(id))}
					onDelete={employees.delete}
				/>
			</Box>
		</Container>
	);
};

export default EmployeesPage;
