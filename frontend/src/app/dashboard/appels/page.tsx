import Link from 'next/link';
import { Button, Container, SvgIcon } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import type { CallStatus } from 'src/lib/constants/calls';
import { ROUTES } from 'src/lib/constants/routes';
import { callParamsSchema } from 'src/lib/schemas/call.schema';
import type { CallParams } from 'src/lib/types/directus';
import { deepMerge } from 'src/lib/utils';
import { getCalls } from 'src/server/actions/call.action';
import CallsPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Appels' },
];

/**
 * Gets the default CallParams of a call status.
 */
const getCallParamsByStatus = (status: CallStatus): CallParams => ({
	page: 1,
	limit: 10,
	fields: ['*', { service: ['*'], vehicle: ['*'], driver_truck: ['*'], driver: ['*'] }],
	filter: { status: { _eq: status } },
	sort: '-date_created',
});

/**
 * List of default params based on call status.
 */
const callParams = {
	in_progress: getCallParamsByStatus('IN_PROGRESS'),
	pending: getCallParamsByStatus('PENDING'),
	reserved: getCallParamsByStatus('RESERVED'),
	cancled: getCallParamsByStatus('CANCELED'),
};

const CallsPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	/** Main table params */
	const params = deepMerge<CallParams>(
		callParamsSchema.parseSearchParams(searchParams),
		callParams.in_progress,
	);

	/** Second table params */
	const secondParams = deepMerge<CallParams>(
		callParamsSchema.parseSearchParams(searchParams),
		callParams.pending,
	);

	const [calls, inProgressCalls, pendingCalls, reservedCalls, canceledCalls] = await Promise.all([
		getCalls(params),
		getCalls(callParams.in_progress),
		getCalls(callParams.pending),
		getCalls(callParams.reserved),
		getCalls(callParams.cancled),
	]);

	return (
		<Container maxWidth="xl">
			<PageHeader
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
			<CallsPageView
				sx={{ mt: 4 }}
				calls={calls}
				inProgressCalls={inProgressCalls}
				pendingCalls={pendingCalls}
				reservedCalls={reservedCalls}
				canceledCalls={canceledCalls}
				params={params}
				secondParams={secondParams}
			/>
		</Container>
	);
};

export default CallsPage;
