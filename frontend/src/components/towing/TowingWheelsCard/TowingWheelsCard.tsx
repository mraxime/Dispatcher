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
import type { MeasureType } from 'src/constants/settings';
import type { Towing } from 'src/types';

type Props = {
	data: Towing;
	measureType?: MeasureType;
};

const TowingWheelsCard: FC<Props> = ({ data: towing }) => {
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
								{towing.wheelCount}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Capacité pneu avant</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.capacityFront && `${towing.capacityFront} kg`}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Capacité pneu arrière</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.capacityBack && `${towing.capacityBack} kg`}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default TowingWheelsCard;
