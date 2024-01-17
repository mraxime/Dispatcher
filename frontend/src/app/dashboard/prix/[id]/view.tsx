'use client';

import type { FC } from 'react';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import PriceForm, { type PriceSubmitData } from 'src/components/prices/PriceForm';
import { usePriceActions } from 'src/hooks/usePrices';
import type { Price } from 'src/lib/types/directus';

type Props = {
	price: Price;
	sx?: SxProps;
};

const PricePageView: FC<Props> = ({ price, sx }) => {
	const priceActions = usePriceActions();

	const handleSubmit = async (data: PriceSubmitData) => {
		await priceActions.update(price.id, data);
	};

	return (
		<Box sx={sx}>
			{/* @ts-expect-error - data.company is a number. */}
			<PriceForm mode="update" defaultValues={price} onSubmit={handleSubmit} />
		</Box>
	);
};

export default PricePageView;
