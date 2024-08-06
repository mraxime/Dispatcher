import type { FC } from 'react';
import {
	Card,
	CardHeader,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Typography,
} from '@mui/material';
import { format } from 'date-fns';

import type { Company } from 'src/lib/types/directus';

type Props = {
	data: Company;
};

const CompanyCard: FC<Props> = ({ data: company }) => {
	return (
		<Card>
			<CardHeader title="Entreprise" />
			<Divider />
			<Table>
				<TableBody>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Id</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{company.id}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Nom</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{company.name}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Adresse</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{company.address}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Active</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{company.active ? 'Oui' : 'Non'}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Date de création</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{company.date_created && format(new Date(company.date_created), 'dd/MM/yyyy')}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default CompanyCard;
