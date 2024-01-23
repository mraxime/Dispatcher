import type { FC } from 'react';
import { TextField } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import type { Company } from 'src/lib/types/directus';

type Props = {
	label?: string;
	items: Company[];
	current?: Company['id'] | null;
	disabled?: boolean;
	isLoading?: boolean;
	error?: string | boolean;
	sx?: SxProps;
	onSelect?: (company: Company) => void;
};

const CompanySelectInput: FC<Props> = ({
	label = 'Entreprise',
	items: companies,
	current = null,
	disabled = false,
	error,
	sx,
	onSelect,
}) => {
	return (
		<TextField
			sx={sx}
			disabled={disabled}
			fullWidth
			label={label}
			name="company"
			select
			defaultValue={current}
			SelectProps={{ native: true }}
			onChange={(value) => {
				const company =
					companies.find((company) => company.id === Number(value.target.value)) ?? null;
				if (onSelect) onSelect(company!);
			}}
			error={Boolean(error)}
			helperText={typeof error === 'string' ? error : undefined}
			InputLabelProps={{
				sx: {
					color: (theme) => theme.palette.neutral[400],
				},
			}}
			InputProps={{
				sx: {
					color: (theme) => theme.palette.neutral[50],
					borderColor: (theme) => theme.palette.neutral[600],
				},
			}}
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
