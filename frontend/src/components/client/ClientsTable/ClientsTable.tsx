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
import { CLIENT_STATUS_MAP, type ClientStatus } from 'src/constants/client';
import { ROUTES } from 'src/constants/routes';
import { useClientActions } from 'src/hooks/useClients';
import type { Client, ClientParams } from 'src/types';

type Props = {
	data: Client[];
	params?: ClientParams;
	totalCount?: number;
	isLoading?: boolean;
};

const ClientsTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', status: 'active' },
	isLoading,
	totalCount,
}) => {
	const router = useRouter();
	const clientActions = useClientActions();

	const actions: (Action<Client> | ((rowData: Client) => Action<Client>))[] = [
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.edit />
				</SvgIcon>
			),
			onClick: () => {
				router.push(ROUTES.ClientPage(rowData.id));
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
				void clientActions.delete(rowData.id);
			},
		}),
	];

	const handleSearch = (search: string) => {
		clientActions.setParams({ ...params, search });
	};

	const handlePageChange = (page: number) => {
		clientActions.setParams({ ...params, page });
	};

	const handlePageLimitChange = (limit: number) => {
		clientActions.setParams({ ...params, limit });
	};

	const handleStatusChange = (status: ClientStatus) => {
		clientActions.setParams({ ...params, status });
	};

	return (
		<Card>
			<Tabs
				onChange={(_, value: ClientStatus) => handleStatusChange(value)}
				scrollButtons="auto"
				value={params.status}
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
				onRefresh={clientActions.revalidate}
				onSearchChange={handleSearch}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handlePageLimitChange}
			/>
		</Card>
	);
};

const COLUMNS: Column<Client>[] = [
	{
		field: 'firstName',
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
						{rowData.firstName} {rowData.lastName}
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
		render: (rowData) =>
			rowData.companyName ? (
				<Typography color="textPrimary" variant="body2">
					{rowData.companyName}
				</Typography>
			) : (
				<Typography color="textSecondary" variant="caption">
					N/A
				</Typography>
			),
	},
	{
		title: 'Téléphone',
		sorting: false,
		render: (rowData) =>
			rowData.phone ? (
				<Typography color="textPrimary" variant="body2">
					{rowData.phone}
				</Typography>
			) : (
				<Typography color="textSecondary" variant="caption">
					N/A
				</Typography>
			),
	},
	{
		title: 'Création',
		render: (rowData) => (
			<Typography color="textPrimary" variant="body2">
				{format(rowData.createdAt, 'dd/MM/yyyy')}
			</Typography>
		),
	},
];

export default ClientsTable;
