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
import { USER_ROLES, USER_ROLES_MAP, type UserRole } from 'src/constants/user';
import { useUserActions } from 'src/hooks/useUsers';
import type { User, UserParams } from 'src/types';

type Props = {
	data: User[];
	params?: UserParams;
	totalCount?: number;
	isLoading?: boolean;
};

const UsersTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', role: undefined },
	isLoading,
	totalCount,
}) => {
	const router = useRouter();
	const userActions = useUserActions();

	const actions: (Action<User> | ((rowData: User) => Action<User>))[] = [
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.edit />
				</SvgIcon>
			),
			onClick: () => {
				router.push(ROUTES.UserPage(rowData.id));
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
				void userActions.delete(rowData.id);
			},
		}),
	];

	const handleSearch = (search: string) => {
		userActions.setParams({ ...params, search });
	};

	const handlePageChange = (page: number) => {
		userActions.setParams({ ...params, page });
	};

	const handlePageLimitChange = (limit: number) => {
		userActions.setParams({ ...params, limit });
	};

	const handleRoleChange = (role: UserRole) => {
		userActions.setParams({ ...params, role });
	};

	return (
		<Card>
			<Tabs
				onChange={(_e, value: UserRole) => handleRoleChange(value)}
				value={params.role}
				variant="scrollable"
			>
				{<Tab value="all" label="Tout" />}
				{USER_ROLES.map((role) => (
					<Tab key={role} value={role} label={USER_ROLES_MAP[role].title} />
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
				onRefresh={userActions.revalidate}
				onSearchChange={handleSearch}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handlePageLimitChange}
			/>
		</Card>
	);
};

const COLUMNS: Column<User>[] = [
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
						href={ROUTES.UserPage(rowData.id)}
						component={Link}
						color="inherit"
						variant="subtitle2"
					>
						{`${rowData.firstName} ${rowData.lastName}`}
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
				{USER_ROLES_MAP[rowData.role].title}
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
				{format(rowData.createdAt, 'dd/MM/yyyy')}
			</Typography>
		),
	},
];

export default UsersTable;
