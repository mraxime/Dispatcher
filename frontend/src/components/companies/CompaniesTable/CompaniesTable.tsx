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
import type { Company, CompanyParams } from 'src/lib/types/directus';
import { isObject } from 'src/lib/utils';

type Props = {
	data: Company[];
	params?: CompanyParams;
	totalCount?: number;
	isLoading?: boolean;
	onRefresh?: () => void;
	onEdit?: (id: number) => void;
	onSelect?: (id: number) => void;
	onDelete?: (id: number) => void;
	onParamsChange?: (params: CompanyParams) => void;
};

const CompaniesTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', filter: { active: { _eq: true } } },
	isLoading,
	totalCount,
	onRefresh,
	onEdit,
	onSelect,
	onDelete,
	onParamsChange,
}) => {
	const actions: (Action<Company> | ((rowData: Company) => Action<Company>))[] = [
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<ConditionalWrapper
					condition={!onEdit}
					wrapper={(children) => <Link href={ROUTES.CompanyPage(rowData.id)}>{children}</Link>}
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
			onParamsChange({ ...params, filter: { ...params.filter, active: { _eq: Boolean(status) } } });
		}
	};

	return (
		<Card>
			<Tabs
				onChange={(_e, value: 0 | 1) => handleStatusChange(value)}
				value={Boolean(params.filter?.active?._eq) ? 1 : 0}
				variant="scrollable"
			>
				<Tab value={1} label="Actifs" />
				<Tab value={0} label="Inactifs" />
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

const COLUMNS: Column<Company>[] = [
	{
		title: 'Entreprise',
		sorting: false,
		render: (rowData) => (
			<Stack direction="row" spacing={1} alignItems="center">
				<Avatar>
					<Icons.company />
				</Avatar>
				<Stack>
					<MuiLink
						href={ROUTES.CompanyPage(rowData.id)}
						component={Link}
						color="inherit"
						variant="subtitle2"
					>
						{`${rowData.name}`}
					</MuiLink>
					<Typography variant="caption" color="textSecondary">
						{rowData.address}
					</Typography>
				</Stack>
			</Stack>
		),
	},
	{
		title: 'Super Admin',
		sorting: false,
		render: (rowData) =>
			isObject(rowData.admin) ? (
				<Stack direction="row" spacing={1} alignItems="center">
					<Avatar>
						<Icons.user />
					</Avatar>
					<Stack>
						<MuiLink
							// Disable for now since a user can be in another company
							// href={ROUTES.UserPage(rowData.admin.id)}
							href="#"
							component={Link}
							color="inherit"
							variant="subtitle2"
						>
							{`${rowData.admin.first_name} ${rowData.admin.last_name}`}
						</MuiLink>
						<Typography variant="caption" color="textSecondary">
							{rowData.admin.email}
						</Typography>
					</Stack>
				</Stack>
			) : (
				<Typography color="textSecondary" variant="caption">
					N/A
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

export default CompaniesTable;
