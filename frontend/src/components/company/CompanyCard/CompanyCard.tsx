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
import { COMPANY_STATUS_MAP } from 'src/constants/company';
import type { Company } from 'src/types';

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
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Status</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{COMPANY_STATUS_MAP[company.status].title}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Date de création</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{format(company.createdAt, 'dd/MM/yyyy')}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default CompanyCard;
