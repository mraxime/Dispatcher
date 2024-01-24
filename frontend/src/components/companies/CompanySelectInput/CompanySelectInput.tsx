import type { FC } from 'react';
import { TextField, type TextFieldProps } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import type { Company } from 'src/lib/types/directus';

type Props = {
	name?: string;
	label?: string;
	items: Company[];
	value?: Company['id'];
	defaultValue?: Company['id'];
	disabled?: boolean;
	isLoading?: boolean;
	error?: string | boolean;
	sx?: SxProps;
	InputProps?: TextFieldProps['InputProps'];
	InputLabelProps?: TextFieldProps['InputLabelProps'];
	onSelect?: (company: Company) => void;
	onBlur?: () => void;
};

const CompanySelectInput: FC<Props> = ({
	name = 'company',
	label = 'Entreprise',
	items: companies,
	value,
	defaultValue,
	disabled = false,
	error,
	sx,
	InputProps,
	InputLabelProps,
	onSelect,
	onBlur,
}) => {
	return (
		<TextField
			sx={sx}
			disabled={disabled}
			fullWidth
			label={label}
			name={name}
			select
			value={value}
			defaultValue={defaultValue}
			SelectProps={{ native: true }}
			onChange={(value) => {
				const company =
					companies.find((company) => company.id === Number(value.target.value)) ?? null;
				if (onSelect) onSelect(company!);
			}}
			onBlur={onBlur}
			error={Boolean(error)}
			helperText={typeof error === 'string' ? error : undefined}
			InputProps={InputProps}
			InputLabelProps={InputLabelProps}
		>
			{companies.length > 0 ? (
				companies.map((company) => (
					<option key={company.id} value={company.id}>
						{company.name}
					</option>
				))
			) : (
				<option disabled>Aucune option</option>
			)}
		</TextField>
	);
};

export default CompanySelectInput;
