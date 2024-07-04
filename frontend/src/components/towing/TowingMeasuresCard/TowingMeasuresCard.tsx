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
import type { Towing } from 'src/types';

type Props = {
	data: Towing;
};

const TowingMeasuresCard: FC<Props> = ({ data: towing }) => {
	return (
		<Card>
			<CardHeader title="Dimensions et poids" />
			<Divider />
			<Table>
				<TableBody>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Longueur plate</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.plateLength && `${towing.plateLength} m`}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Hauteur plate</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.plateHeight && `${towing.plateHeight} m`}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Longueur totale</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.totalLength && `${towing.totalLength} m`}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Hauteur totale</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.totalHeight && `${towing.totalHeight} m`}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Capacité poids</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.capacity && `${towing.capacity} kg`}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Capacité poids dégel</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.capacityThaw && `${towing.capacityThaw} kg`}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default TowingMeasuresCard;
