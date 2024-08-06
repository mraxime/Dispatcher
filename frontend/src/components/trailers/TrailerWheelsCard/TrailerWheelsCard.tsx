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

import type { MeasureType } from 'src/lib/constants/measures';
import type { Trailer } from 'src/lib/types/directus';

type Props = {
	data: Trailer;
	measureType?: MeasureType;
};

const TrailerWheelsCard: FC<Props> = ({ data: trailer }) => {
	return (
		<Card>
			<CardHeader title="Pneus" />
			<Divider />
			<Table>
				<TableBody>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Nombre de roues</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{trailer.nb}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Capacité pneu avant</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{trailer.capacity_front && `${trailer.capacity_front} kg`}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Capacité pneu arrière</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{trailer.capacity_back && `${trailer.capacity_back} kg`}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default TrailerWheelsCard;
