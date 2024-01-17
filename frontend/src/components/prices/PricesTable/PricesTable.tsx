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
import {
	PRICE_STATUS_MAP,
	PRICE_TYPES_MAP,
	type PriceStatus,
	type PriceType,
} from 'src/lib/constants/prices';
import { ROUTES } from 'src/lib/constants/routes';
import type { Price, PriceParams } from 'src/lib/types/directus';
import { toCurrency } from 'src/lib/utils';

type Props = {
	data: Price[];
	params?: PriceParams;
	totalCount?: number;
	isLoading?: boolean;
	onRefresh?: () => void;
	onEdit?: (id: number) => void;
	onSelect?: (id: number) => void;
	onDelete?: (id: number) => void;
	onParamsChange?: (params: PriceParams) => void;
};

const PricesTable: FC<Props> = ({
	data,
	params = { page: 1, limit: 10, search: '', filter: { status: { _eq: 'ACTIVE' } } },
	isLoading,
	totalCount,
	onRefresh,
	onEdit,
	onSelect,
	onDelete,
	onParamsChange,
}) => {
	const actions: (Action<Price> | ((rowData: Price) => Action<Price>))[] = [
		(rowData) => ({
			tooltip: 'Modifier',
			icon: () => (
				<ConditionalWrapper
					condition={!onEdit}
					wrapper={(children) => <Link href={ROUTES.PricePage(rowData.id)}>{children}</Link>}
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

	const handleStatusChange = (status: PriceStatus) => {
		if (onParamsChange) {
			onParamsChange({ ...params, filter: { ...params.filter, status: { _eq: status } } });
		}
	};

	return (
		<Card>
			<Tabs
				onChange={(_, value: PriceStatus) => handleStatusChange(value)}
				scrollButtons="auto"
				value={params.filter?.status?._eq}
				variant="scrollable"
			>
				{Object.values(PRICE_STATUS_MAP).map(({ title, value }) => (
					<Tab value={value} key={value} label={title} />
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
						{PRICE_TYPES_MAP[rowData.type as PriceType].title}
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
				{toCurrency(rowData.value, { priceType: rowData.type as PriceType })}
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
				{rowData.date_created && format(new Date(rowData.date_created), 'dd/MM/yyyy')}
			</Typography>
		),
	},
];

export default PricesTable;
