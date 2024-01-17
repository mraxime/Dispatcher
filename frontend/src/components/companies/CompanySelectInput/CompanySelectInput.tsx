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
	onSelect?: (company: Company | null) => void;
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
			name="theme"
			select
			value={current}
			SelectProps={{ native: true }}
			onSelect={(value) => {
				const company = companies.find((company) => company.id === value) ?? null;
				if (onSelect) onSelect(company);
			}}
			error={Boolean(error)}
			helperText={typeof error === 'string' ? error : undefined}
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
