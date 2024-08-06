import type { FC } from 'react';
import {
	Card,
	CardActions,
	CardHeader,
	Divider,
	Stack,
	SvgIcon,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Typography,
} from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import type { Call } from 'src/lib/types/directus';

type Props = {
	data: Call;
};

const CallTrajectCard: FC<Props> = ({ data: call }) => {
	return (
		<Card variant="outlined">
			<CardHeader
				avatar={
					<SvgIcon color="primary">
						<Icons.location />
					</SvgIcon>
				}
				title={<Typography variant="h5">Trajet</Typography>}
				sx={{ p: 2, bgcolor: 'background.default' }}
			/>
			<Divider />
			<Table>
				<TableBody>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Origine</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{call.address}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Destination</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{call.destination}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<CardActions
				sx={{
					bgcolor: 'background.default',
					textAlign: 'right',
					width: '100%',
				}}
			>
				<Stack
					sx={{
						textAlign: 'right',
						width: '100%',
					}}
				>
					<Typography variant="body2">- Km Total</Typography>
					<Typography variant="body2">- Minutes</Typography>
				</Stack>
			</CardActions>
		</Card>
	);
};

export default CallTrajectCard;
