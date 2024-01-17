import type { FC } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import type { Trailer } from 'src/lib/types/directus';

type Props = {
	label?: string;
	items: Trailer[];
	current?: Trailer['id'] | null;
	disabled?: boolean;
	isLoading?: boolean;
	error?: string | boolean;
	sx?: SxProps;
	onSelect?: (trailer: Trailer | null) => void;
};

const TrailerSearchInput: FC<Props> = ({
	label = 'Remorque',
	items: trailers,
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
			options={trailers}
			value={trailers.find((trailer) => trailer.id === current) ?? null}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			onChange={(_, value) => {
				if (onSelect) onSelect(value);
			}}
			getOptionLabel={(option) => option.name}
			getOptionDisabled={(option) => !option.in_service}
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

export default TrailerSearchInput;
