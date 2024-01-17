import Link from 'next/link';
import { Button, Container, SvgIcon } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { userParamsSchema } from 'src/lib/schemas/user.schema';
import type { UserParams } from 'src/lib/types/directus';
import { deepMerge } from 'src/lib/utils';
import { getUsers } from 'src/server/actions/user.action';
import SuperAdminsPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Super Admins' },
];

const SuperAdminsPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const params = deepMerge<UserParams>(userParamsSchema.parseSearchParams(searchParams), {
		page: 1,
		limit: 10,
		fields: ['*', { role: ['*'] }],
		filter: { role: { name: { _eq: 'Super Admin' } } },
		sort: ['role.name', '-date_created'],
	});

	const superAdmins = await getUsers(params, false);

	return (
		<Container maxWidth="xl">
			<PageHeader
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
			<SuperAdminsPageView sx={{ mt: 4 }} superAdmins={superAdmins} params={params} />
		</Container>
	);
};

export default SuperAdminsPage;
