'use client';

import { useMemo, type FC } from 'react';
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
import { USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import type { User, UserParams } from 'src/lib/types/directus';
import { isObject } from 'src/lib/utils';

type Props = {
	data: User[];
	params?: UserParams;
	basePath?: string;
	tabs?: string[];
	totalCount?: number;
	isLoading?: boolean;
	onRefresh?: () => void;
	onEdit?: (id: string) => void;
	onSelect?: (id: string) => void;
	onDelete?: (id: string) => void;
	onParamsChange?: (params: UserParams) => void;
};

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
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<ConditionalWrapper
					condition={!onEdit}
					wrapper={(children) => <Link href={`${basePath}/${rowData.id}`}>{children}</Link>}
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
				options={{ pageSize: params.limit, searchText: params.search }}
				onRefresh={onRefresh}
				onSearchChange={handleSearch}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handlePageLimitChange}
			/>
		</Card>
	);
};

export default UsersTable;
