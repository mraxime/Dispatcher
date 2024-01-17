import Link from 'next/link';
import { Button, Container, SvgIcon } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import { userParamsSchema } from 'src/lib/schemas/user.schema';
import type { UserParams } from 'src/lib/types/directus';
import { deepMerge } from 'src/lib/utils';
import { getUsers } from 'src/server/actions/user.action';
import EmployeesPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Employés' },
];

const EmployeesPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const params = deepMerge<UserParams>(userParamsSchema.parseSearchParams(searchParams), {
		page: 1,
		limit: 10,
		fields: ['*', { role: ['*'] }],
		filter: { role: { name: { _in: USER_ROLES } } },
		sort: ['role.name', '-date_created'],
	});

	const employees = await getUsers(params);

	return (
		<Container maxWidth="xl">
			<PageHeader
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
			<EmployeesPageView sx={{ mt: 4 }} employees={employees} params={params} />
		</Container>
	);
};

export default EmployeesPage;
