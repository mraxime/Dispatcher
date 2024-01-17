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
import { CLIENT_STATUS_MAP, type ClientStatus } from 'src/lib/constants/clients';
import { ROUTES } from 'src/lib/constants/routes';
import type { Client, ClientParams } from 'src/lib/types/directus';

type Props = {
	data: Client[];
	params?: ClientParams;
	totalCount?: number;
	isLoading?: boolean;
	onRefresh?: () => void;
	onEdit?: (id: number) => void;
	onSelect?: (id: number) => void;
	onDelete?: (id: number) => void;
	onParamsChange?: (params: ClientParams) => void;
};

const ClientsTable: FC<Props> = ({
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
	const actions: (Action<Client> | ((rowData: Client) => Action<Client>))[] = [
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<ConditionalWrapper
					condition={!onEdit}
					wrapper={(children) => <Link href={ROUTES.ClientPage(rowData.id)}>{children}</Link>}
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

	const handleStatusChange = (status: ClientStatus) => {
		if (onParamsChange) {
			onParamsChange({ ...params, filter: { ...params.filter, status: { _eq: status } } });
		}
	};

	return (
		<Card>
			<Tabs
				onChange={(_, value: ClientStatus) => handleStatusChange(value)}
				scrollButtons="auto"
				value={params.filter?.status?._eq}
				variant="scrollable"
			>
				{Object.values(CLIENT_STATUS_MAP).map(({ title, value }) => (
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
				options={{ pageSize: params.limit, searchText: params.search }}
				onRefresh={onRefresh}
				onSearchChange={handleSearch}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handlePageLimitChange}
			/>
		</Card>
	);
};

const COLUMNS: Column<Client>[] = [
	{
		field: 'name',
		title: 'Nom',
		sorting: false,
		render: (rowData) => (
			<Stack direction="row" spacing={1} alignItems="center">
				<Avatar>
					<Icons.user />
				</Avatar>
				<Stack>
					<MuiLink
						href={ROUTES.ClientPage(rowData.id)}
						component={Link}
						color="inherit"
						variant="subtitle2"
					>
						{rowData.name}
					</MuiLink>
					<Typography color="textSecondary" variant="caption">
						{rowData.email}
					</Typography>
				</Stack>
			</Stack>
		),
	},
	{
		title: 'Entreprise',
		sorting: false,
		render: (rowData) => (
			<Typography color="textPrimary" variant="body2">
				{rowData.companyName}
			</Typography>
		),
	},
	{
		title: 'Téléphone',
		sorting: false,
		render: (rowData) => (
			<Typography color="textPrimary" variant="body2">
				{rowData.phone}
			</Typography>
		),
	},
	{
		title: 'Création',
		render: (rowData) => (
			<Typography color="textPrimary" variant="body2">
				{rowData.date_created && format(new Date(rowData.date_created), 'dd/MM/yyyy')}
			</Typography>
		),
	},
];

export default ClientsTable;
