import type { FC } from 'react';
import { Autocomplete, TextField, type SxProps } from '@mui/material';

import type { Company } from 'src/lib/types/directus';

type Props = {
	label?: string;
	items: Company[];
	current?: Company['id'] | null;
	disabled?: boolean;
	isLoading?: boolean;
	error?: string | boolean;
	sx?: SxProps;
	onSelect?: (company: Company | null) => void;
};

const CompanySearchInput: FC<Props> = ({
	label = 'Entreprise',
	items: companies,
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
			options={companies}
			value={companies.find((company) => company.id === current) ?? null}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			onChange={(_, value) => {
				if (onSelect) onSelect(value);
				if (value) document.activeElement?.blur();
			}}
			getOptionLabel={(option) => option.name}
			getOptionDisabled={(option) => !option.active}
			renderInput={(params) => (
				<TextField
					variant="filled"
					label={label}
					error={Boolean(error)}
					helperText={typeof error === 'string' ? error : undefined}
					{...params}
					InputLabelProps={{
						...params.InputLabelProps,
					}}
					InputProps={{
						...params.InputProps,
						sx: {
							color: (theme) => theme.palette.neutral[50],
							borderColor: (theme) => theme.palette.neutral[600],
						},
					}}
				/>
			)}
		/>
	);
};

export default CompanySearchInput;
