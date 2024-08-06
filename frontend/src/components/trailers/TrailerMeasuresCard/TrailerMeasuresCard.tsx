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

import type { Trailer } from 'src/lib/types/directus';

type Props = {
	data: Trailer;
};

const TrailerMeasuresCard: FC<Props> = ({ data: trailer }) => {
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
								{trailer.plate_length && `${trailer.plate_length} m`}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Hauteur plate</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{trailer.plate_height && `${trailer.plate_height} m`}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Longueur totale</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{trailer.total_length && `${trailer.total_length} m`}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Hauteur totale</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{trailer.total_height && `${trailer.total_height} m`}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Capacité poids</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{trailer.capacity && `${trailer.capacity} kg`}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Capacité poids dégel</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{trailer.capacity_thaw && `${trailer.capacity_thaw} kg`}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default TrailerMeasuresCard;
