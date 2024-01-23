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
import UsersPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Utilisateurs' },
];

const UsersPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const params = deepMerge<UserParams>(userParamsSchema.parseSearchParams(searchParams), {
		page: 1,
		limit: 10,
		fields: ['*', { role: ['*'] }],
		filter: { role: { name: { _in: USER_ROLES } } },
		sort: ['role.name', '-date_created'],
	});

	const users = await getUsers(params);

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Liste des utilisateurs"
				icon={<Icons.user />}
				breadcrumbItems={breadcrumbs}
				actionElement={
					<Button
						href={ROUTES.NewUserPage()}
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
			<UsersPageView sx={{ mt: 4 }} users={users} params={params} />
		</Container>
	);
};

export default UsersPage;
