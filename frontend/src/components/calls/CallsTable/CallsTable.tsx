'use client';

import type { FC } from 'react';
import Link from 'next/link';
import type { Query } from '@directus/sdk';
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
import { CALL_STATUS_MAP, type CallStatus } from 'src/lib/constants/calls';
import { ROUTES } from 'src/lib/constants/routes';
import type { Call, DirectusSchema } from 'src/lib/types/directus';
import { isObject } from 'src/lib/utils';

const COLUMNS: Column<Call>[] = [
	{
		title: 'Véhicule en panne',
		sorting: false,
		render: (rowData) =>
			isObject(rowData.vehicle) && (
				<Stack direction="row" spacing={1} alignItems="center">
					<Avatar>
						<Icons.vehicle />
					</Avatar>
					<Stack>
						<MuiLink
							href={ROUTES.CallPage(rowData.id)}
							component={Link}
							color="inherit"
							variant="subtitle2"
						>
							{rowData.vehicle.model}
						</MuiLink>
						{isObject(rowData.service) && (
							<div style={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '11rem' }}>
								<Typography
									noWrap
									variant="caption"
									color="textSecondary"
									display="inline-flex"
									alignItems="center"
									gap={1}
								>
									<SvgIcon fontSize="inherit">
										<Icons.location />
									</SvgIcon>
									{rowData.destination}
								</Typography>
							</div>
						)}
					</Stack>
				</Stack>
			),
	},
	{
		title: 'Client',
		sorting: false,
		render: (rowData) =>
			rowData.name ? (
				<Stack direction="row" spacing={1} alignItems="center">
					<Avatar>
						<Icons.user />
					</Avatar>
					<Stack>
						<MuiLink
							href={ROUTES.CallPage(rowData.id)}
							component={Link}
							color="inherit"
							variant="subtitle2"
						>
							{`${rowData.name}`}
						</MuiLink>
						<Typography
							variant="caption"
							color="textSecondary"
							display="inline-flex"
							alignItems="center"
							gap={1}
						>
							<SvgIcon fontSize="inherit">
								<Icons.call />
							</SvgIcon>
							{rowData.phone}
						</Typography>
					</Stack>
				</Stack>
			) : (
				<Typography variant="caption" color="textSecondary">
					N/A
				</Typography>
			),
	},
	{
		title: 'Remorque',
		sorting: false,
		render: (rowData) =>
			isObject(rowData.driver_truck) ? (
				<Stack direction="row" spacing={1} alignItems="center">
					<Avatar>
						<Icons.trailer />
					</Avatar>
					<Stack>
						<MuiLink
							href={ROUTES.TrailerPage(rowData.driver_truck.id)}
							component={Link}
							color="inherit"
							variant="subtitle2"
						>
							{rowData.driver_truck.name}
						</MuiLink>
						<Typography variant="caption" color="textSecondary">
							{rowData.driver_truck.model}
						</Typography>
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
			isObject(rowData.driver) ? (
				<Stack direction="row" spacing={1} alignItems="center">
					<Avatar>
						<Icons.user />
					</Avatar>
					<Stack>
						<MuiLink
							href={ROUTES.EmployeePage(rowData.driver.id)}
							component={Link}
							color="inherit"
							variant="subtitle2"
						>
							{`${rowData.driver.first_name} ${rowData.driver.last_name}`}
						</MuiLink>
						{rowData.driver.phone && (
							<Typography
								variant="caption"
								color="textSecondary"
								display="inline-flex"
								alignItems="center"
								gap={1}
							>
								<SvgIcon fontSize="inherit">
									<Icons.call />
								</SvgIcon>
								{rowData.driver.phone}
							</Typography>
						)}
					</Stack>
				</Stack>
			) : (
				<Typography variant="caption" color="textSecondary">
					N/A
				</Typography>
			),
	},
	{
		title: 'Code de service',
		hidden: true,
		sorting: false,
		render: (rowData) =>
			isObject(rowData.service) && (
				<Typography color="textPrimary" variant="body2">
					{rowData.service.name}
				</Typography>
			),
	},
	{
		title: 'Date de création',
		render: (rowData) => (
			<Typography color="textPrimary" variant="body2">
				{format(new Date(rowData.date_created), 'dd/MM/yyyy')}
			</Typography>
		),
	},
];

type Props = {
	data: Call[];
	params?: Params;
	totalCount?: number;
	isLoading?: boolean;
	enabledTabs?: Array<CallStatus>;
	onRefresh?: () => void;
	onEdit?: (id: number) => void;
	onSelect?: (id: number) => void;
	onDelete?: (id: number) => void;
	onParamsChange?: (params: Params) => void;
};

type Params = Query<DirectusSchema, Call>;

const CallsTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', filter: { status: { _eq: 'PENDING' } } },
	isLoading,
	totalCount,
	enabledTabs = [],
	onRefresh,
	onEdit,
	onSelect,
	onDelete,
	onParamsChange,
}) => {
	const actions: (Action<Call> | ((rowData: Call) => Action<Call>))[] = [
		{
			icon: Icons.refresh,
			tooltip: 'Mettre a jour',
			isFreeAction: true,
			onClick: () => {
				if (onRefresh) onRefresh;
			},
		},
		(rowData) => ({
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.edit />
				</SvgIcon>
			),
			tooltip: 'Modifier',
			hidden: !onEdit,
			onClick: () => {
				if (onEdit) onEdit(rowData.id);
			},
		}),
		(rowData) => ({
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.goto />
				</SvgIcon>
			),
			tooltip: 'Voir',
			hidden: !onSelect,
			onClick: () => {
				if (onSelect) onSelect(rowData.id);
			},
		}),
		(rowData) => ({
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.delete />
				</SvgIcon>
			),
			tooltip: 'Supprimer',
			hidden: !onDelete,
			onClick: () => {
				if (onDelete) onDelete(rowData.id);
			},
		}),
	];

	const handleSearch = (search: string) => {
		if (onParamsChange) onParamsChange({ ...params, search });
	};

	const handlePageChange = (page: number) => {
		if (onParamsChange) onParamsChange({ ...params, page });
	};

	const handlePageLimitChange = (limit: number) => {
		if (onParamsChange) onParamsChange({ ...params, limit });
	};

	const handleStatusChange = (status: CallStatus) => {
		if (onParamsChange) {
			onParamsChange({ ...params, filter: { ...params.filter, status: { _eq: status } } });
		}
	};

	return (
		<Card>
			<Tabs
				onChange={(_, value: CallStatus) => handleStatusChange(value)}
				scrollButtons="auto"
				value={params.filter?.status?._eq}
				variant="scrollable"
			>
				{Object.values(CALL_STATUS_MAP)
					.filter(({ value }) => enabledTabs?.includes(value) ?? true)
					.map(({ title, value }) => {
						const isPending = value === 'PENDING';
						return (
							<Tab
								key={value}
								value={value}
								label={
									/* calls count here */
									<Badge color="primary" badgeContent={isPending ? 0 : undefined}>
										<Box>{title}</Box>
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
				onSearchChange={handleSearch}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handlePageLimitChange}
			/>
		</Card>
	);
};

export default CallsTable;
