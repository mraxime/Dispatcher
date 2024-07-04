import type { FC } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import type { Towing } from 'src/types';

type Props = {
	label?: string;
	items: Towing[];
	current?: Towing['id'] | null;
	disabled?: boolean;
	isLoading?: boolean;
	error?: string | boolean;
	sx?: SxProps;
	onSelect?: (towing: Towing | null) => void;
};

const TowingSearchInput: FC<Props> = ({
	label = 'Remorque',
	items: towings,
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
			options={towings}
			value={towings.find((towing) => towing.id === current) ?? null}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			onChange={(_, value) => {
				if (onSelect) onSelect(value);
			}}
			getOptionLabel={(option) => option.name}
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

export default TowingSearchInput;
