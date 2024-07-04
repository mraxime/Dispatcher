import Link from 'next/link';
import { Box, Button, Container, SvgIcon } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import TowingsTable from 'src/components/towing/TowingsTable';
import { ROUTES } from 'src/constants/routes';
import { getTowings } from 'src/server/services';
import { towingParamsSchema } from 'src/validations/towing';
import { pageGuard } from '../guard';

const TowingsPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const session = await pageGuard('towings:read');
	const params = towingParamsSchema.parse(searchParams);
	const towings = await getTowings(params);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{ name: 'Remorques' },
	];

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Liste des remorques"
				icon={<Icons.towing />}
				breadcrumbItems={breadcrumbs}
				actionElement={
					<Button
						href={ROUTES.NewTowingPage()}
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
				<TowingsTable data={towings} params={params} />
			</Box>
		</Container>
	);
};

export default TowingsPage;
