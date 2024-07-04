import Link from 'next/link';
import { Box, Button, Container, Unstable_Grid2 as Grid, Stack, SvgIcon } from '@mui/material';
import { and, count, eq } from 'drizzle-orm';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import CallCanceledCard from 'src/components/call/CallCanceledCard';
import CallInProgressCard from 'src/components/call/CallInProgressCard';
import CallPendingCard from 'src/components/call/CallPendingCard';
import CallReservedCard from 'src/components/call/CallReservedCard';
import CallsTable from 'src/components/call/CallsTable';
import { ROUTES } from 'src/constants/routes';
import { db } from 'src/server/database';
import { callTable } from 'src/server/database/schema';
import { getCalls } from 'src/server/services';
import { callParamsSchema } from 'src/validations/call';
import { pageGuard } from '../guard';

const CallsPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const session = await pageGuard('calls:read');

	/** Main table params */
	const params = callParamsSchema.parse(searchParams);

	const calls = await getCalls(params, {
		driver: session.permissionKeys.includes('users:read') ? true : undefined,
		service: session.permissionKeys.includes('services:read') ? true : undefined,
		towing: session.permissionKeys.includes('towings:read') ? true : undefined,
		client: session.permissionKeys.includes('clients:read') ? true : undefined,
		vehicle: session.permissionKeys.includes('clients:read') ? true : undefined,
	});

	const [[pendingCalls], [inProgressCalls], [reservedCalls], [canceledCalls]] = await Promise.all([
		db
			.select({ count: count() })
			.from(callTable)
			.where(
				and(eq(callTable.companyId, session.selectedCompany.id), eq(callTable.status, 'pending')),
			),
		db
			.select({ count: count() })
			.from(callTable)
			.where(
				and(
					eq(callTable.companyId, session.selectedCompany.id),
					eq(callTable.status, 'in_progress'),
				),
			),
		db
			.select({ count: count() })
			.from(callTable)
			.where(
				and(eq(callTable.companyId, session.selectedCompany.id), eq(callTable.status, 'reserved')),
			),
		db
			.select({ count: count() })
			.from(callTable)
			.where(
				and(eq(callTable.companyId, session.selectedCompany.id), eq(callTable.status, 'canceled')),
			),
	]);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{ name: 'Appels' },
	];

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Liste des appels"
				icon={<Icons.call />}
				breadcrumbItems={breadcrumbs}
				actionElement={
					<Button
						href={ROUTES.NewCallPage()}
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

			<Stack mt={4} spacing={4}>
				<Box>
					<Grid
						container
						spacing={{
							xs: 3,
							lg: 4,
						}}
					>
						<Grid xs={12} md={3}>
							<CallPendingCard amount={pendingCalls!.count} />
						</Grid>
						<Grid xs={12} md={3}>
							<CallInProgressCard amount={inProgressCalls!.count} />
						</Grid>
						<Grid xs={12} md={3}>
							<CallReservedCard amount={reservedCalls!.count} />
						</Grid>
						<Grid xs={12} md={3}>
							<CallCanceledCard amount={canceledCalls!.count} />
						</Grid>
					</Grid>
				</Box>

				<CallsTable data={calls} params={params} />
			</Stack>
		</Container>
	);
};

export default CallsPage;
