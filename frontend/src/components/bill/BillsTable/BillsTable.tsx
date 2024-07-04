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
import { BILL_STATUS, BILL_STATUS_MAP, type BillStatus } from 'src/constants/bill';
import { ROUTES } from 'src/constants/routes';
import { useBillActions } from 'src/hooks/useBills';
import type { Bill, BillParams } from 'src/types';
import { isObject, toCurrency } from 'src/utils';

type Props = {
	data: Bill[];
	params?: BillParams;
	totalCount?: number;
	isLoading?: boolean;
};

const BillsTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', status: 'pending' },
	isLoading,
	totalCount,
}) => {
	const router = useRouter();
	const billActions = useBillActions();

	const actions: (Action<Bill> | ((rowData: Bill) => Action<Bill>))[] = [
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.edit />
				</SvgIcon>
			),
			onClick: () => {
				router.push(ROUTES.BillPage(rowData.id));
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
				void billActions.delete(rowData.id);
			},
		}),
	];

	const handleSearch = (search: string) => {
		billActions.setParams({ ...params, search });
	};

	const handlePageChange = (page: number) => {
		billActions.setParams({ ...params, page });
	};

	const handlePageLimitChange = (limit: number) => {
		billActions.setParams({ ...params, limit });
	};

	const handleStatusChange = (status: BillStatus) => {
		billActions.setParams({ ...params, status });
	};

	return (
		<Card>
			<Tabs
				onChange={(_, value: BillStatus) => handleStatusChange(value)}
				scrollButtons="auto"
				value={params.status}
				variant="scrollable"
			>
				{BILL_STATUS.map((status) => (
					<Tab key={status} value={status} label={BILL_STATUS_MAP[status].title} />
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
				onRefresh={billActions.revalidate}
				onSearchChange={handleSearch}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handlePageLimitChange}
			/>
		</Card>
	);
};

const COLUMNS: Column<Bill>[] = [
	{
		field: 'id',
		title: 'ID',
		sorting: false,
		render: (rowData) =>
			isObject(rowData.price) ? (
				<Stack direction="row" spacing={1} alignItems="center">
					<Avatar>
						<Icons.bill />
					</Avatar>
					<Stack>
						<MuiLink
							href={ROUTES.BillPage(rowData.id)}
							component={Link}
							color="inherit"
							variant="subtitle2"
						>
							{`Facture #${rowData.id}`}
						</MuiLink>
					</Stack>
				</Stack>
			) : null,
	},
	{
		title: 'Montant',
		sorting: false,
		render: (rowData) =>
			isObject(rowData.price) ? (
				<Typography variant="body2">{`${toCurrency(rowData.price.value)}`}</Typography>
			) : null,
	},
	{
		title: 'Facturé à',
		sorting: false,
		render: (rowData) =>
			isObject(rowData.client) && isObject(rowData.client.company) ? (
				<Typography color="textPrimary" variant="body2">
					{rowData.client.company.name}
				</Typography>
			) : null,
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

export default BillsTable;
