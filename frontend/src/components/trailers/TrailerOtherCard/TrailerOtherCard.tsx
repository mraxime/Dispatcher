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

const TrailerOtherCard: FC<Props> = ({ data: trailer }) => {
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
								{trailer.brake_type}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Conteneur</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{trailer.container ? 'Oui' : 'Non'}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Wheel lift</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{trailer.wheel_lift ? 'Oui' : 'Non'}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>IFTA</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{trailer.ifta ? 'Oui' : 'Non'}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Note</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{trailer.note}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default TrailerOtherCard;
