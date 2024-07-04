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
import { TOWING_STATUS_MAP, TOWING_TYPES_MAP } from 'src/constants/towing';
import type { Towing } from 'src/types';

type Props = {
	data: Towing;
};

const TowingCard: FC<Props> = ({ data: towing }) => {
	return (
		<Card>
			<CardHeader title="Remorque" />
			<Divider />
			<Table>
				<TableBody>
					{/*
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Id</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.id}
							</Typography>
						</TableCell>
					</TableRow>
          */}
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Nom</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.name}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Marque/Modèle/Année</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.model}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Masse net</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.weight && `${towing.weight} kg`}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Numéro de série</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.serialNb}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Numéro de plaque</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.plateNb}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Type</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{TOWING_TYPES_MAP[towing.type].title}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Status</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{TOWING_STATUS_MAP[towing.status].title}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default TowingCard;
