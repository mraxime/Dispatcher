import type { FC } from 'react';
import { Stack } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import PriceSearchInput from 'src/components/prices/PriceSearchInput';
import type { Price } from 'src/lib/types/directus';
import type { ServiceSubmitData } from './types';

type Props = {
	prices: Price[];
};

const ServiceFormPrices: FC<Props> = ({ prices }) => {
	const form = useFormContext<ServiceSubmitData>();
	const selectedPriceIds = form.watch('prices');
	const availablePrices = prices.filter((value) => !selectedPriceIds.includes(value.id));

	const priceActions = {
		add: (id: number) => {
			const newValue = [...selectedPriceIds, id];
			form.setValue('prices', newValue, { shouldDirty: true });
		},
		remove: (index: number) => {
			const newValue = [...selectedPriceIds];
			newValue.splice(index, 1);
			form.setValue('prices', newValue, { shouldDirty: true });
		},
		set: (index: number, id: number) => {
			const newValue = [...selectedPriceIds];
			newValue[index] = id;
			form.setValue('prices', newValue, { shouldDirty: true });
		},
	};

	return (
		<Stack spacing={3.5}>
			{selectedPriceIds.map((id, index) => {
				const filteredPrices = [...availablePrices];
				const priceToAdd = prices.find((val) => val.id === id);
				if (priceToAdd) filteredPrices.push(priceToAdd);
				return (
					<PriceSearchInput
						key={id}
						items={filteredPrices}
						current={id}
						label={`Prix ${index + 1}`}
						onSelect={(price) => {
							price ? priceActions.set(index, price.id) : priceActions.remove(index);
						}}
					/>
				);
			})}
			<PriceSearchInput
				items={availablePrices}
				label={`Prix ${selectedPriceIds.length + 1}`}
				onSelect={(price) => {
					if (!price) return;
					priceActions.add(price.id);
					// @ts-expect-error - looks ok
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					document.activeElement?.blur();
				}}
			/>
		</Stack>
	);
};

export default ServiceFormPrices;
