import type { FC } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import type { User } from 'src/types';

type Props = {
	label?: string;
	items: User[];
	current?: User['id'] | null;
	disabled?: boolean;
	isLoading?: boolean;
	error?: string | boolean;
	sx?: SxProps;
	onSelect?: (user: User | null) => void;
};

const UserSearchInput: FC<Props> = ({
	label = 'Utilisateur',
	items: users,
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
			options={users}
			value={users.find((user) => user.id === current) ?? null}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			onChange={(_, value) => {
				if (onSelect) onSelect(value);
			}}
			getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
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

export default UserSearchInput;
