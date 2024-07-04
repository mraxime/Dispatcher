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
import { USER_STATUS_MAP } from 'src/constants/user';
import type { User } from 'src/types';

type Props = {
	data: User;
	title?: string;
};

const UserCard: FC<Props> = ({ data: user, title = 'Utilisateur' }) => {
	return (
		<Card>
			<CardHeader title={title} />
			<Divider />
			<Table>
				<TableBody>
					{/*
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Id</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.id}
							</Typography>
						</TableCell>
					</TableRow>
          */}
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Prénom</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.firstName}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Nom</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.lastName}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Role</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{user.role}
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
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Status</TableCell>
						<TableCell>
							<Typography variant="body2" color="textPrimary">
								{USER_STATUS_MAP[user.status].title}
							</Typography>
						</TableCell>
					</TableRow>
					{/*
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
          */}
				</TableBody>
			</Table>
		</Card>
	);
};

export default UserCard;
