'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Action, Column } from '@material-table/core';
import {
	Avatar,
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
import { ROUTES } from 'src/constants/routes';
import { TOWING_STATUS, TOWING_STATUS_MAP, type TowingStatus } from 'src/constants/towing';
import { useTowingActions } from 'src/hooks/useTowings';
import type { Towing, TowingParams } from 'src/types';

type Props = {
	data: Towing[];
	params?: TowingParams;
	totalCount?: number;
	isLoading?: boolean;
};

const TowingsTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', status: 'active' },
	isLoading,
	totalCount,
}) => {
	const router = useRouter();
	const towingActions = useTowingActions();

	const actions: (Action<Towing> | ((rowData: Towing) => Action<Towing>))[] = [
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.edit />
				</SvgIcon>
			),
			onClick: () => {
				router.push(ROUTES.TowingPage(rowData.id));
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
				void towingActions.delete(rowData.id);
			},
		}),
	];

	const handleSearch = (search: string) => {
		towingActions.setParams({ ...params, search });
	};

	const handlePageChange = (page: number) => {
		towingActions.setParams({ ...params, page });
	};

	const handlePageLimitChange = (limit: number) => {
		towingActions.setParams({ ...params, limit });
	};

	const handleStatusChange = (status: TowingStatus) => {
		towingActions.setParams({ ...params, status });
	};

	return (
		<Card>
			<Tabs
				onChange={(_, value: TowingStatus) => handleStatusChange(value)}
				scrollButtons="auto"
				value={params.status}
				variant="scrollable"
			>
				{TOWING_STATUS.map((status) => (
					<Tab key={status} value={status} label={TOWING_STATUS_MAP[status].title} />
				))}
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
				onRefresh={towingActions.revalidate}
				onSearchChange={handleSearch}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handlePageLimitChange}
			/>
		</Card>
	);
};

const COLUMNS: Column<Towing>[] = [
	{
		field: 'name',
		title: 'Remorque',
		sorting: false,
		render: (rowData) => (
			<Stack direction="row" spacing={1} alignItems="center">
				<Avatar>
					<Icons.towing />
				</Avatar>
				<Stack>
					<MuiLink
						href={ROUTES.TowingPage(rowData.id)}
						component={Link}
						color="inherit"
						variant="subtitle2"
					>
						{rowData.name}
					</MuiLink>
					<Typography color="textSecondary" variant="caption">
						{rowData.model}
					</Typography>
				</Stack>
			</Stack>
		),
	},
	{
		title: 'Date de création',
		render: (rowData) => (
			<Typography color="textPrimary" variant="body2">
				{format(rowData.createdAt, 'dd/MM/yyyy')}
			</Typography>
		),
	},
];

export default TowingsTable;
