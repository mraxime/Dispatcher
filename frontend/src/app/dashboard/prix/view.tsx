'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import PricesTable from 'src/components/prices/PricesTable';
import { usePriceActions } from 'src/hooks/usePrices';
import { ROUTES } from 'src/lib/constants/routes';
import type { Price, PriceParams } from 'src/lib/types/directus';

type Props = {
	prices: Price[];
	params: PriceParams;
	sx?: SxProps;
};

const PricesPageView: FC<Props> = ({ prices, params, sx }) => {
	const router = useRouter();
	const priceActions = usePriceActions();

	return (
		<Box sx={sx}>
			<PricesTable
				data={prices}
				params={params}
				onRefresh={priceActions.revalidate}
				onParamsChange={priceActions.setParams}
				onEdit={(id) => router.push(ROUTES.PricePage(id))}
				onDelete={priceActions.delete}
			/>
		</Box>
	);
};

export default PricesPageView;
