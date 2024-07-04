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

const TowingOtherCard: FC<Props> = ({ data: towing }) => {
	return (
		<Card>
			<CardHeader title="Autre" />
			<Divider />
			<Table>
				<TableBody>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Type de frein</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.brakeType}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Conteneur</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.container ? 'Oui' : 'Non'}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Wheel lift</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.wheelLift ? 'Oui' : 'Non'}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>IFTA</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.ifta ? 'Oui' : 'Non'}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Note</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{towing.note}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default TowingOtherCard;
