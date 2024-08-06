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

import type { User } from 'src/lib/types/directus';

type Props = {
	data: User;
};

const EmployeeCard: FC<Props> = ({ data: user }) => {
	return (
		<Card>
			<CardHeader title="Employé" />
			<Divider />
			<Table>
				<TableBody>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Id</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.id}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Prénom</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.first_name}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Nom</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.last_name}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Role</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.role?.name}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Courriel</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.email}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Téléphone</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.phone}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Poste</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.ext}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Bloqué</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.blocked ? 'Oui' : 'Non'}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Date de naissance</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.birthday && format(new Date(user.birthday), 'dd/MM/yyyy')}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Date d'embauche</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.hireday && format(new Date(user.hireday), 'dd/MM/yyyy')}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default EmployeeCard;
