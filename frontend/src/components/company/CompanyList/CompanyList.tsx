import type { FC } from 'react';
import {
	Checkbox,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	type SxProps,
} from '@mui/material';
import type { Company } from 'src/types';

type Props = {
	data: Company[];
	defaultValue?: Company['id'] | null;
	sx?: SxProps;
	onSelect?: (company: Company) => void;
};

const CompanyList: FC<Props> = ({ data: companies, defaultValue, sx, onSelect }) => {
	return (
		<List sx={sx}>
			{companies.map((company) => (
				<ListItem key={company.id} disablePadding>
					<ListItemButton
						selected={company.id === defaultValue}
						onClick={() => onSelect?.(company)}
						sx={{
							px: 1.5,
							py: 0,
							color: (theme) => theme.palette.neutral[400],
							'&.Mui-selected': {
								color: (theme) => theme.palette.neutral[50],
								backgroundColor: 'transparent',
								'&:hover': {
									backgroundColor: 'transparent',
								},
							},
						}}
					>
						<ListItemIcon sx={{ mr: 0 }}>
							<Checkbox
								edge="start"
								checked={company.id === defaultValue}
								tabIndex={-1}
								disableRipple
							/>
						</ListItemIcon>
						<ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={company.name} />
					</ListItemButton>
				</ListItem>
			))}
		</List>
	);
};

export default CompanyList;
