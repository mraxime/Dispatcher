'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Unstable_Grid2 as Grid, Stack } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import CallCanceledCard from 'src/components/calls/CallCanceledCard';
import CallInProgressCard from 'src/components/calls/CallInProgressCard';
import CallPendingCard from 'src/components/calls/CallPendingCard';
import CallReservedCard from 'src/components/calls/CallReservedCard';
import CallsTable from 'src/components/calls/CallsTable';
import { useCallActions } from 'src/hooks/useCalls';
import { ROUTES } from 'src/lib/constants/routes';
import type { Call, CallParams } from 'src/lib/types/directus';

type Props = {
	calls: Call[];
	inProgressCalls: Call[];
	pendingCalls: Call[];
	reservedCalls: Call[];
	canceledCalls: Call[];
	params: CallParams;
	secondParams: CallParams;
	sx?: SxProps;
};

const CallsPageView: FC<Props> = ({
	calls,
	inProgressCalls,
	pendingCalls,
	reservedCalls,
	canceledCalls,
	params,
	secondParams,
	sx,
}) => {
	const router = useRouter();
	const callActions = useCallActions();

	return (
		<Stack spacing={4} sx={sx}>
			<Box>
				<Grid
					container
					spacing={{
						xs: 3,
						lg: 4,
					}}
				>
					<Grid xs={12} md={3}>
						<CallPendingCard amount={pendingCalls.length} />
					</Grid>
					<Grid xs={12} md={3}>
						<CallInProgressCard amount={inProgressCalls.length} />
					</Grid>
					<Grid xs={12} md={3}>
						<CallReservedCard amount={reservedCalls.length} />
					</Grid>
					<Grid xs={12} md={3}>
						<CallCanceledCard amount={canceledCalls.length} />
					</Grid>
				</Grid>
			</Box>

			<CallsTable
				data={pendingCalls}
				params={secondParams}
				onRefresh={callActions.revalidate}
				onParamsChange={callActions.setParams}
				onEdit={(id) => router.push(ROUTES.CallPage(id))}
				enabledTabs={['PENDING']}
				onDelete={callActions.delete}
			/>

			<CallsTable
				data={calls}
				params={params}
				onRefresh={callActions.revalidate}
				onParamsChange={callActions.setParams}
				onEdit={(id) => router.push(ROUTES.CallPage(id))}
				enabledTabs={['IN_PROGRESS', 'IMPOUNDED', 'RESERVED', 'COMPLETED', 'CANCELED']}
				onDelete={callActions.delete}
			/>
		</Stack>
	);
};

export default CallsPageView;
