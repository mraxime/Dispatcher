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
import {
	PRICE_STATUS,
	PRICE_STATUS_MAP,
	PRICE_TYPES_MAP,
	type PriceStatus,
} from 'src/constants/price';
import { ROUTES } from 'src/constants/routes';
import { usePriceActions } from 'src/hooks/usePrices';
import type { Price, PriceParams } from 'src/types';
import { toCurrency } from 'src/utils';

type Props = {
	data: Price[];
	params?: PriceParams;
	totalCount?: number;
	isLoading?: boolean;
};

const PricesTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', status: 'active' },
	isLoading,
	totalCount,
}) => {
	const router = useRouter();
	const priceActions = usePriceActions();

	const actions: (Action<Price> | ((rowData: Price) => Action<Price>))[] = [
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<SvgIcon fontSize="small" color="action">
					<Icons.edit />
				</SvgIcon>
			),
			onClick: () => {
				router.push(ROUTES.PricePage(rowData.id));
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
				void priceActions.delete(rowData.id);
			},
		}),
	];

	const handleSearch = (search: string) => {
		priceActions.setParams({ ...params, search });
	};

	const handlePageChange = (page: number) => {
		priceActions.setParams({ ...params, page });
	};

	const handlePageLimitChange = (limit: number) => {
		priceActions.setParams({ ...params, limit });
	};

	const handleStatusChange = (status: PriceStatus) => {
		priceActions.setParams({ ...params, status });
	};

	return (
		<Card>
			<Tabs
				onChange={(_, value: PriceStatus) => handleStatusChange(value)}
				scrollButtons="auto"
				value={params.status}
				variant="scrollable"
			>
				{PRICE_STATUS.map((status) => (
					<Tab key={status} value={status} label={PRICE_STATUS_MAP[status].title} />
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
				onRefresh={priceActions.revalidate}
				onSearchChange={handleSearch}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handlePageLimitChange}
			/>
		</Card>
	);
};

const COLUMNS: Column<Price>[] = [
	{
		field: 'name',
		title: 'Nom du prix',
		sorting: false,
		render: (rowData) => (
			<Stack direction="row" spacing={1} alignItems="center">
				<Avatar>
					<Icons.price />
				</Avatar>
				<Stack>
					<MuiLink
						href={ROUTES.PricePage(rowData.id)}
						component={Link}
						color="inherit"
						variant="subtitle2"
					>
						{rowData.name}
					</MuiLink>
					<Typography variant="caption" color="textSecondary">
						{PRICE_TYPES_MAP[rowData.type].title}
					</Typography>
				</Stack>
			</Stack>
		),
	},
	{
		title: 'Montant',
		sorting: false,
		render: (rowData) => (
			<Typography color="textPrimary" variant="body2">
				{toCurrency(Number(rowData.value), { priceType: rowData.type })}
			</Typography>
		),
	},
	{
		title: 'taxable',
		render: (rowData) => (
			<Typography color="textPrimary" variant="body2">
				{rowData.taxable ? 'Oui' : 'Non'}
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

export default PricesTable;
