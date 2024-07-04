import Link from 'next/link';
import { Box, Button, Container, SvgIcon } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import UsersTable from 'src/components/user/UsersTable';
import { ROUTES } from 'src/constants/routes';
import { getUsers } from 'src/server/services';
import { userParamsSchema } from 'src/validations/auth';
import { pageGuard } from '../guard';

const UsersPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const session = await pageGuard('users:read');
	const params = userParamsSchema.parse(searchParams);
	const users = await getUsers(params);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{ name: 'Utilisateurs' },
	];

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

			<Box mt={4}>
				<UsersTable data={users} params={params} />
			</Box>
		</Container>
	);
};

export default UsersPage;
