import type { FC } from 'react';
import { Autocomplete, TextField, type SxProps } from '@mui/material';

import type { Price } from 'src/lib/types/directus';
import { toCurrency } from 'src/lib/utils';

type Props = {
	label?: string;
	items: Price[];
	current?: Price['id'] | null;
	disabled?: boolean;
	isLoading?: boolean;
	error?: string | boolean;
	sx?: SxProps;
	onSelect?: (value: Price | null) => void;
};

const PriceSearchInput: FC<Props> = ({
	label = 'Prix associé',
	items: prices,
	current = null,
	disabled = false,
	isLoading = false,
	error,
	sx,
	onSelect,
}) => {
	return (
		<Autocomplete
			sx={sx}
			disabled={disabled}
			loading={isLoading}
			options={prices}
			value={prices.find((price) => price.id === current) ?? null}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			onChange={(_, value) => {
				if (onSelect) onSelect(value);
			}}
			getOptionLabel={(price) =>
				`${price.name} (${toCurrency(price.value, { priceType: price.type })})`
			}
			getOptionDisabled={(option) => option.status === 'INACTIVE'}
			renderInput={(params) => (
				<TextField
					label={label}
					error={Boolean(error)}
					helperText={typeof error === 'string' ? error : undefined}
					{...params}
				/>
			)}
		/>
	);
};

export default PriceSearchInput;
