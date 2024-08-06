'use client';

import type { FC } from 'react';
import Link from 'next/link';
import type { Query } from '@directus/sdk';
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
import { ROUTES } from 'src/lib/constants/routes';
import { SERVICE_STATUS_MAP, type ServiceStatus } from 'src/lib/constants/services';
import type { DirectusSchema, Service } from 'src/lib/types/directus';

const COLUMNS: Column<Service>[] = [
	{
		field: 'name',
		title: 'Nom du service',
		sorting: false,
		render: (rowData) => (
			<Stack direction="row" spacing={1} alignItems="center">
				<Avatar>
					<Icons.service />
				</Avatar>
				<Stack>
					<MuiLink
						href={ROUTES.ServicePage(rowData.id)}
						component={Link}
						color="inherit"
						variant="subtitle2"
					>
						{rowData.name}
					</MuiLink>
					<Typography variant="caption" color="textSecondary">
						{rowData.prices?.length ?? 0} prix associé
					</Typography>
				</Stack>
			</Stack>
		),
	},
	{
		title: 'Statut',
		sorting: false,
		render: (rowData) => (
			<Typography color="textPrimary" variant="body2">
				{rowData.status === 'ACTIVE'
					? 'Actif'
					: rowData.status === 'INACTIVE'
						? 'Innactif'
						: rowData.status}
			</Typography>
		),
	},
	{
		title: 'Créé le',
		field: 'date_created',
		render: (rowData) => (
			<Typography color="textPrimary" variant="body2">
				{rowData.date_created && format(new Date(rowData.date_created), 'dd/MM/yyyy')}
			</Typography>
		),
	},
];

type Props = {
	data: Service[];
	params?: Params;
	totalCount?: number;
	isLoading?: boolean;
	onRefresh?: () => void;
	onEdit?: (id: number) => void;
	onSelect?: (id: number) => void;
	onDelete?: (id: number) => void;
	onParamsChange?: (params: Params) => void;
};

type Params = Query<DirectusSchema, Service>;

const ServicesTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', filter: { status: { _eq: 'ACTIVE' } } },
	isLoading,
	totalCount,
	onRefresh,
	onEdit,
	onSelect,
	onDelete,
	onParamsChange,
}) => {
	const actions: (Action<Service> | ((rowData: Service) => Action<Service>))[] = [
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
					<Icons.refresh />
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

	const handleStatusChange = (status: ServiceStatus) => {
		if (onParamsChange) {
			onParamsChange({ ...params, filter: { ...params.filter, status: { _eq: status } } });
		}
	};

	return (
		<Card>
			<Tabs
				onChange={(_e, value: ServiceStatus) => handleStatusChange(value)}
				value={params.filter?.status?._eq}
				variant="scrollable"
			>
				{Object.values(SERVICE_STATUS_MAP).map(({ title, value }) => (
					<Tab value={value} label={title} key={value} />
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
				onSearchChange={handleSearch}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handlePageLimitChange}
			/>
		</Card>
	);
};

export default ServicesTable;
