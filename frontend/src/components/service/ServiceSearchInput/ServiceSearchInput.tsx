import type { FC } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import type { Service } from 'src/types';

type Props = {
	items: Service[];
	current?: Service['id'] | null;
	disabled?: boolean;
	isLoading?: boolean;
	required?: boolean;
	onSelect?: (service: Service | null) => void;
	error?: string | boolean;
	sx?: SxProps;
};

const ServiceSearchInput: FC<Props> = ({
	items: services,
	current = null,
	disabled = false,
	isLoading = false,
	required = false,
	onSelect,
	error,
	sx,
}) => {
	return (
		<Autocomplete
			sx={sx}
			disabled={disabled}
			loading={isLoading}
			options={services}
			value={services.find((driver) => driver.id === current) ?? null}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			onChange={(_, value) => {
				if (onSelect) onSelect(value);
			}}
			getOptionLabel={(option) => option.name}
			getOptionDisabled={(option) => option.status === 'inactive'}
			renderInput={(params) => (
				<TextField
					required={required}
					label="Code de service"
					error={Boolean(error)}
					helperText={typeof error === 'string' ? error : undefined}
					{...params}
				/>
			)}
		/>
	);
};

export default ServiceSearchInput;
