'use client';

import type { ElementType, FC, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Action, Column } from '@material-table/core';
import {
	Avatar,
	Badge,
	Box,
	Card,
	Divider,
	Link as MuiLink,
	Stack,
	SvgIcon,
	Tab,
	Tabs,
	Typography,
} from '@mui/material';
import { format } from 'date-fns';
import CustomMaterialTable from 'src/components/base/CustomMaterialTable';
import { Icons } from 'src/components/base/Icons';
import { CALL_STATUS, CALL_STATUS_MAP, type CallStatus } from 'src/constants/call';
import { ROUTES } from 'src/constants/routes';
import { useCallActions } from 'src/hooks/useCalls';
import type { CallWithRelations as Call, CallParams } from 'src/types';

type Props = {
	data: Call[];
	params?: CallParams;
	totalCount?: number;
	isLoading?: boolean;
};

const CallsTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', status: 'pending' },
	isLoading,
	totalCount,
}) => {
	const router = useRouter();
	const callActions = useCallActions();

	const actions: (Action<Call> | ((rowData: Call) => Action<Call>))[] = [
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.edit />
				</SvgIcon>
			),
			onClick: () => {
				router.push(ROUTES.CallPage(rowData.id));
			},
		}),
		(rowData) => ({
			tooltip: 'Supprimer',
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.delete />
				</SvgIcon>
			),
			onClick: () => {
				void callActions.delete(rowData.id);
			},
		}),
	];

	const handleSearch = (search: string) => {
		callActions.setParams({ ...params, search });
	};

	const handlePageChange = (page: number) => {
		callActions.setParams({ ...params, page });
	};

	const handlePageLimitChange = (limit: number) => {
		callActions.setParams({ ...params, limit });
	};

	const handleStatusChange = (status: CallStatus) => {
		callActions.setParams({ ...params, status });
	};

	return (
		<Card>
			<Tabs
				onChange={(_, value: CallStatus) => handleStatusChange(value)}
				scrollButtons="auto"
				value={params.status}
				variant="scrollable"
			>
				{<Tab value="all" label="Tout" />}
				{CALL_STATUS.map((status) => {
					const isPending = status === 'pending';
					return (
						<Tab
							key={status}
							value={status}
							label={
								/* calls count here */
								<Badge color="primary" badgeContent={isPending ? 0 : undefined}>
									<Box>{CALL_STATUS_MAP[status].title}</Box>
								</Badge>
							}
						/>
					);
				})}
			</Tabs>
			<Divider />
			<CustomMaterialTable
				columns={COLUMNS}
				actions={actions}
				data={data}
				page={params.page}
				totalCount={totalCount}
				isLoading={isLoading}
				options={{ pageSize: params.limit, searchText: params.search }}
				onRefresh={callActions.revalidate}
				onSearchChange={handleSearch}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handlePageLimitChange}
			/>
		</Card>
	);
};

const COLUMNS: Column<Call>[] = [
	{
		title: 'Client en panne',
		sorting: false,
		render: (rowData) =>
			rowData.client && rowData.vehicle ? (
				<Stack direction="row" spacing={1} alignItems="center">
					<Avatar>
						<Icons.user />
					</Avatar>
					<Stack>
						<MuiLink
							href={ROUTES.ClientPage(rowData.client.id)}
							component={Link}
							color="inherit"
							variant="subtitle2"
						>
							{[rowData.client.firstName, rowData.client.lastName].filter(Boolean).join(' ')}
						</MuiLink>

						<Stack>
							<DetailValue Icon={Icons.vehicle} text={rowData.vehicle.model} />
						</Stack>
					</Stack>
				</Stack>
			) : (
				<Typography variant="caption" color="textSecondary">
					N/A
				</Typography>
			),
	},
	{
		title: 'Service',
		sorting: false,
		render: (rowData) =>
			rowData.service ? (
				<Stack direction="row" spacing={1} alignItems="center">
					<Avatar>
						<Icons.service />
					</Avatar>
					<Stack>
						<MuiLink
							href={ROUTES.ServicePage(rowData.service.id)}
							component={Link}
							color="inherit"
							variant="subtitle2"
						>
							{`${rowData.service.name}`}
						</MuiLink>

						<Stack>
							<DetailValue Icon={Icons.location} text={rowData.checkpoint} />
						</Stack>
					</Stack>
				</Stack>
			) : (
				<Typography variant="caption" color="textSecondary">
					N/A
				</Typography>
			),
	},
	{
		title: 'Chauffeur',
		sorting: false,
		render: (rowData) =>
			rowData.driver && rowData.towing ? (
				<Stack direction="row" spacing={1} alignItems="center">
					<Avatar>
						<Icons.user />
					</Avatar>
					<Stack>
						<MuiLink
							href={ROUTES.UserPage(rowData.driver.id)}
							component={Link}
							color="inherit"
							variant="subtitle2"
						>
							{[rowData.driver.firstName, rowData.driver.lastName].filter(Boolean).join(' ')}
						</MuiLink>

						<Stack>
							<DetailValue Icon={Icons.towing} text={rowData.towing.name} />
						</Stack>
					</Stack>
				</Stack>
			) : (
				<Typography variant="caption" color="textSecondary">
					N/A
				</Typography>
			),
	},
	{
		title: 'Status',
		sorting: false,
		render: (rowData) => (
			<Badge
				sx={{ ml: 4, textWrap: 'nowrap' }}
				color={CALL_STATUS_MAP[rowData.status].color}
				badgeContent={`${CALL_STATUS_MAP[rowData.status].title}`}
			/>
		),
	},
	{
		title: 'Date de création',
		sorting: false,
		render: (rowData) => (
			<Typography color="textPrimary" variant="body2">
				{format(rowData.createdAt, 'dd/MM/yyyy')}
			</Typography>
		),
	},
];

export default CallsTable;

const DetailValue: FC<{ Icon?: ElementType; text: ReactNode }> = ({ Icon, text }) => {
	return (
		<div style={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '10rem' }}>
			<Typography
				noWrap
				variant="caption"
				color="textSecondary"
				display="inline-flex"
				alignItems="center"
				gap={0.75}
			>
				{Icon && (
					<SvgIcon fontSize="inherit">
						<Icon />
					</SvgIcon>
				)}
				{text}
			</Typography>
		</div>
	);
};
