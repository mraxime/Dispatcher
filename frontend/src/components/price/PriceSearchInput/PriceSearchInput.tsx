import type { FC } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import type { Price } from 'src/types';
import { toCurrency } from 'src/utils';

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
				`${price.name} (${toCurrency(Number(price.value), { priceType: price.type })})`
			}
			getOptionDisabled={(option) => option.status === 'inactive'}
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
