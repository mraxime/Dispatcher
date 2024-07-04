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
import { SERVICE_STATUS, SERVICE_STATUS_MAP, type ServiceStatus } from 'src/constants/service';
import { useServiceActions } from 'src/hooks/useServices';
import type { Service, ServiceParams } from 'src/types';

type Props = {
	data: Service[];
	params?: ServiceParams;
	totalCount?: number;
	isLoading?: boolean;
};

const ServicesTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', status: 'active' },
	isLoading,
	totalCount,
}) => {
	const router = useRouter();
	const serviceActions = useServiceActions();

	const actions: (Action<Service> | ((rowData: Service) => Action<Service>))[] = [
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.edit />
				</SvgIcon>
			),
			onClick: () => {
				router.push(ROUTES.ServicePage(rowData.id));
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
				void serviceActions.delete(rowData.id);
			},
		}),
	];

	const handleSearch = (search: string) => {
		serviceActions.setParams({ ...params, search });
	};

	const handlePageChange = (page: number) => {
		serviceActions.setParams({ ...params, page });
	};

	const handlePageLimitChange = (limit: number) => {
		serviceActions.setParams({ ...params, limit });
	};

	const handleStatusChange = (status: ServiceStatus) => {
		serviceActions.setParams({ ...params, status });
	};

	return (
		<Card>
			<Tabs
				onChange={(_e, value: ServiceStatus) => handleStatusChange(value)}
				value={params.status}
				variant="scrollable"
			>
				{SERVICE_STATUS.map((status) => (
					<Tab key={status} value={status} label={SERVICE_STATUS_MAP[status].title} />
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
				onRefresh={serviceActions.revalidate}
				onSearchChange={handleSearch}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handlePageLimitChange}
			/>
		</Card>
	);
};

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
				{rowData.status === 'active'
					? 'Actif'
					: rowData.status === 'inactive'
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
				{format(rowData.createdAt, 'dd/MM/yyyy')}
			</Typography>
		),
	},
];

export default ServicesTable;
