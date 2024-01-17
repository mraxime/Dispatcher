'use client';

import type { FC } from 'react';
import Link from 'next/link';
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

import ConditionalWrapper from 'src/components/base/ConditionalWrapper';
import CustomMaterialTable from 'src/components/base/CustomMaterialTable';
import { Icons } from 'src/components/base/Icons';
import { ROUTES } from 'src/lib/constants/routes';
import type { Trailer, TrailerParams } from 'src/lib/types/directus';

type Props = {
	data: Trailer[];
	params?: TrailerParams;
	totalCount?: number;
	isLoading?: boolean;
	onRefresh?: () => void;
	onEdit?: (id: number) => void;
	onSelect?: (id: number) => void;
	onDelete?: (id: number) => void;
	onParamsChange?: (params: TrailerParams) => void;
};

const TrailersTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', filter: { in_service: { _eq: true } } },
	isLoading,
	totalCount,
	onRefresh,
	onEdit,
	onSelect,
	onDelete,
	onParamsChange,
}) => {
	const actions: (Action<Trailer> | ((rowData: Trailer) => Action<Trailer>))[] = [
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<ConditionalWrapper
					condition={!onEdit}
					wrapper={(children) => <Link href={ROUTES.TrailerPage(rowData.id)}>{children}</Link>}
				>
					<SvgIcon fontSize="small" color="action">
						<Icons.edit />
					</SvgIcon>
				</ConditionalWrapper>
			),
			onClick: () => {
				if (onEdit) onEdit(rowData.id);
			},
		}),
		(rowData) => ({
			tooltip: 'Voir',
			hidden: !onSelect,
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.goto />
				</SvgIcon>
			),
			onClick: () => {
				if (onSelect) onSelect(rowData.id);
			},
		}),
		(rowData) => ({
			tooltip: 'Supprimer',
			hidden: !onDelete,
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.delete />
				</SvgIcon>
			),
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

	const handleStatusChange = (status: 0 | 1) => {
		if (onParamsChange) {
			onParamsChange({
				...params,
				filter: { ...params.filter, in_service: { _eq: Boolean(status) } },
			});
		}
	};

	return (
		<Card>
			<Tabs
				onChange={(_, value: 0 | 1) => handleStatusChange(value)}
				scrollButtons="auto"
				value={params.filter?.in_service?._eq ? 1 : 0}
				variant="scrollable"
			>
				<Tab value={1} label="En service" />
				<Tab value={0} label="Hors service" />
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
				onRefresh={onRefresh}
				onSearchChange={handleSearch}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handlePageLimitChange}
			/>
		</Card>
	);
};

const COLUMNS: Column<Trailer>[] = [
	{
		field: 'name',
		title: 'Remorque',
		sorting: false,
		render: (rowData) => (
			<Stack direction="row" spacing={1} alignItems="center">
				<Avatar>
					<Icons.trailer />
				</Avatar>
				<Stack>
					<MuiLink
						href={ROUTES.TrailerPage(rowData.id)}
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
		field: 'belongs_to',
		title: 'Appartient à',
		sorting: false,
		render: (rowData) =>
			rowData.belongs_to ? (
				<Stack direction="row" spacing={1} alignItems="center">
					<Avatar>
						<Icons.user />
					</Avatar>
					<Stack>
						<MuiLink
							href={ROUTES.TrailersPage()}
							component={Link}
							color="inherit"
							variant="subtitle2"
						>
							{rowData.belongs_to}
						</MuiLink>
					</Stack>
				</Stack>
			) : (
				<Typography variant="caption" color="textSecondary">
					N/A
				</Typography>
			),
	},
	{
		title: 'Date de création',
		render: (rowData) => (
			<Typography color="textPrimary" variant="body2">
				{rowData.date_created && format(new Date(rowData.date_created), 'dd/MM/yyyy')}
			</Typography>
		),
	},
];

export default TrailersTable;
