'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Unstable_Grid2 as Grid, Stack, SvgIcon } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import CallCanceledCard from 'src/components/calls/CallCanceledCard';
import CallInProgressCard from 'src/components/calls/CallInProgressCard';
import CallPendingCard from 'src/components/calls/CallPendingCard';
import CallReservedCard from 'src/components/calls/CallReservedCard';
import CallsTable from 'src/components/calls/CallsTable';
import { useCalls } from 'src/hooks/useCalls';
import type { CallStatus } from 'src/lib/constants/calls';
import { ROUTES } from 'src/lib/constants/routes';
import type { CallParams } from 'src/lib/types/directus';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Appels' },
];

const getCallParamsByStatus = (status: CallStatus): CallParams => ({
	page: 1,
	limit: 10,
	fields: ['*', { service: ['*'], vehicle: ['*'], driver_truck: ['*'], driver: ['*'] }],
	filter: { status: { _eq: status } },
	sort: '-date_created',
});

const CallsPage = () => {
	const router = useRouter();
	const pendingCalls = useCalls(getCallParamsByStatus('PENDING'));
	const inProgressCalls = useCalls(getCallParamsByStatus('IN_PROGRESS'));
	const reservedCalls = useCalls(getCallParamsByStatus('RESERVED'));
	const canceledCalls = useCalls(getCallParamsByStatus('CANCELED'));

	const params: CallParams = {
		page: 1,
		limit: 10,
		fields: ['*', { service: ['*'], vehicle: ['*'], driver_truck: ['*'], driver: ['*'] }],
		filter: { status: { _eq: 'IN_PROGRESS' } },
		sort: '-date_created',
	};

	const calls = useCalls(params);

	return (
		<Container maxWidth="xl">
			<Header
				title="Formulaires d'appels"
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

			<Stack spacing={4} mt={4}>
				<Box>
					<Grid
						container
						spacing={{
							xs: 3,
							lg: 4,
						}}
					>
						<Grid xs={12} md={3}>
							<CallPendingCard amount={pendingCalls.data.length} />
						</Grid>
						<Grid xs={12} md={3}>
							<CallInProgressCard amount={inProgressCalls.data.length} />
						</Grid>
						<Grid xs={12} md={3}>
							<CallReservedCard amount={reservedCalls.data.length} />
						</Grid>
						<Grid xs={12} md={3}>
							<CallCanceledCard amount={canceledCalls.data.length} />
						</Grid>
					</Grid>
				</Box>

				<CallsTable
					data={pendingCalls.data}
					params={pendingCalls.params}
					isLoading={pendingCalls.isLoading}
					onRefresh={pendingCalls.revalidate}
					onParamsChange={pendingCalls.setParams}
					onEdit={(id) => router.push(ROUTES.CallPage(id))}
					enabledTabs={['PENDING']}
					onDelete={pendingCalls.delete}
				/>

				<CallsTable
					data={calls.data}
					params={calls.params}
					isLoading={calls.isLoading}
					onRefresh={calls.revalidate}
					onParamsChange={calls.setParams}
					onEdit={(id) => router.push(ROUTES.CallPage(id))}
					enabledTabs={['IN_PROGRESS', 'IMPOUNDED', 'RESERVED', 'COMPLETED', 'CANCELED']}
					onDelete={calls.delete}
				/>
			</Stack>
		</Container>
	);
};

export default CallsPage;
