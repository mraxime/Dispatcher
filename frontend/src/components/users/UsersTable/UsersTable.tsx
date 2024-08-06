'use client';

import { useMemo, type FC } from 'react';
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
import { USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import type { DirectusSchema, User } from 'src/lib/types/directus';
import { isObject } from 'src/lib/utils';

type Props = {
	data: User[];
	params?: Params;
	basePath?: string;
	tabs?: string[];
	totalCount?: number;
	isLoading?: boolean;
	onRefresh?: () => void;
	onEdit?: (id: string) => void;
	onSelect?: (id: string) => void;
	onDelete?: (id: string) => void;
	onParamsChange?: (params: Params) => void;
};

type Params = Query<DirectusSchema, User>;

const UsersTable: FC<Props> = ({
	data,
	params = {
		page: 1,
		limit: 10,
		search: '',
		filter: { role: { name: { _eq: USER_ROLES[0] } } },
	},
	basePath = ROUTES.EmployeesPage(),
	tabs = USER_ROLES,
	isLoading,
	totalCount,
	onRefresh,
	onEdit,
	onSelect,
	onDelete,
	onParamsChange,
}) => {
	const COLUMNS: Column<User>[] = useMemo(
		() => [
			{
				title: 'Utilisateur',
				field: 'first_name',
				sorting: false,
				render: (rowData) => (
					<Stack direction="row" spacing={1} alignItems="center">
						<Avatar>
							<Icons.user />
						</Avatar>
						<Stack>
							<MuiLink
								href={`${basePath}/${rowData.id}`}
								component={Link}
								color="inherit"
								variant="subtitle2"
							>
								{`${rowData.first_name} ${rowData.last_name}`}
							</MuiLink>
							<Typography variant="caption" color="textSecondary">
								{rowData.email}
							</Typography>
						</Stack>
					</Stack>
				),
			},
			{
				title: 'Rôle',
				render: (rowData) => (
					<Typography color="textPrimary" variant="body2">
						{isObject(rowData.role) ? rowData.role.name : ''}
					</Typography>
				),
			},
			{
				title: 'Téléphone',
				field: 'phone',
				sorting: false,
				render: (rowData) =>
					rowData.phone ? (
						<Stack>
							<Typography color="inherit" variant="body2">
								{rowData.phone}
							</Typography>
							<Typography color="textSecondary" variant="caption">
								{rowData.ext && `poste ${rowData.ext}`}
							</Typography>
						</Stack>
					) : (
						<Typography color="textSecondary" variant="caption">
							N/A
						</Typography>
					),
			},
			{
				title: 'Date de création',
				field: 'date_created',
				render: (rowData) => (
					<Typography color="textPrimary" variant="body2">
						{format(new Date(rowData.date_created), 'dd/MM/yyyy')}
					</Typography>
				),
			},
		],
		[basePath],
	);

	const actions: (Action<User> | ((rowData: User) => Action<User>))[] = [
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
		if (!onParamsChange) return;
		return { ...params, search };
	};

	const handlePageChange = (page: number) => {
		if (onParamsChange) onParamsChange({ ...params, page });
	};

	const handlePageLimitChange = (limit: number) => {
		if (onParamsChange) onParamsChange({ ...params, limit });
	};

	const handleTabChange = (tab: string) => {
		if (onParamsChange) {
			onParamsChange({
				...params,
				filter: { ...params.filter, role: { name: tab === 'ALL' ? { _in: tabs } : { _eq: tab } } },
			});
		}
	};

	return (
		<Card>
			<Tabs
				onChange={(_e, value: string) => handleTabChange(value)}
				value={params.filter?.role?.name?._eq ?? 'ALL'}
				variant="scrollable"
			>
				{tabs.length > 2 && <Tab value="ALL" label="Tout" />}
				{tabs.map((role) => (
					<Tab value={role} label={role} key={role} />
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

export default UsersTable;
