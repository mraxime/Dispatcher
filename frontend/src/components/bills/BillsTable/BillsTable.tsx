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
import { BILL_STATUS_MAP, type BillStatus } from 'src/lib/constants/bills';
import { ROUTES } from 'src/lib/constants/routes';
import type { Bill, BillParams } from 'src/lib/types/directus';
import { isObject, toCurrency } from 'src/lib/utils';

type Props = {
	data: Bill[];
	params?: BillParams;
	totalCount?: number;
	isLoading?: boolean;
	onRefresh?: () => void;
	onEdit?: (id: number) => void;
	onSelect?: (id: number) => void;
	onDelete?: (id: number) => void;
	onParamsChange?: (params: BillParams) => void;
};

const BillsTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', filter: { status: { _eq: 'PAID' } } },
	isLoading,
	totalCount,
	onRefresh,
	onEdit,
	onSelect,
	onDelete,
	onParamsChange,
}) => {
	const actions: (Action<Bill> | ((rowData: Bill) => Action<Bill>))[] = [
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<ConditionalWrapper
					condition={!onEdit}
					wrapper={(children) => <Link href={ROUTES.BillPage(rowData.id)}>{children}</Link>}
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

	const handleStatusChange = (status: BillStatus) => {
		if (onParamsChange) {
			onParamsChange({ ...params, filter: { ...params.filter, status: { _eq: status } } });
		}
	};

	return (
		<Card>
			<Tabs
				onChange={(_, value: BillStatus) => handleStatusChange(value)}
				scrollButtons="auto"
				value={params.filter?.status?._eq}
				variant="scrollable"
			>
				{Object.values(BILL_STATUS_MAP).map(({ value, title }) => (
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
				{rowData.date_created && format(new Date(rowData.date_created), 'dd/MM/yyyy')}
			</Typography>
		),
	},
];

export default BillsTable;
