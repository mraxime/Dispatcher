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
import { COMPANY_STATUS, COMPANY_STATUS_MAP, type CompanyStatus } from 'src/constants/company';
import { ROUTES } from 'src/constants/routes';
import { useCompanyActions } from 'src/hooks/useCompanies';
import type { Company, CompanyParams } from 'src/types';

type Props = {
	data: Company[];
	params?: CompanyParams;
	totalCount?: number;
	isLoading?: boolean;
};

const CompaniesTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', status: 'active' },
	isLoading,
	totalCount,
}) => {
	const router = useRouter();
	const companyActions = useCompanyActions();

	const actions: (Action<Company> | ((rowData: Company) => Action<Company>))[] = [
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.edit />
				</SvgIcon>
			),
			onClick: () => {
				router.push(ROUTES.CompanyPage(rowData.id));
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
				void companyActions.delete(rowData.id);
			},
		}),
	];

	const handleSearch = (search: string) => {
		companyActions.setParams({ ...params, search });
	};

	const handlePageChange = (page: number) => {
		companyActions.setParams({ ...params, page });
	};

	const handlePageLimitChange = (limit: number) => {
		companyActions.setParams({ ...params, limit });
	};

	const handleStatusChange = (status: CompanyStatus) => {
		companyActions.setParams({ ...params, status });
	};

	return (
		<Card>
			<Tabs
				onChange={(_e, value: CompanyStatus) => handleStatusChange(value)}
				value={params.status}
				variant="scrollable"
			>
				{COMPANY_STATUS.map((status) => (
					<Tab key={status} value={status} label={COMPANY_STATUS_MAP[status].title} />
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
				onRefresh={companyActions.revalidate}
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
		title: 'Date de création',
		render: (rowData) => (
			<Typography color="textPrimary" variant="body2">
				{format(rowData.createdAt, 'dd/MM/yyyy')}
			</Typography>
		),
	},
];

export default CompaniesTable;
