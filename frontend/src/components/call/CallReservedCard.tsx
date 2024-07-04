'use client';

import type { FC } from 'react';
import PhonePausedIcon from '@mui/icons-material/PhonePaused';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

type Props = {
	amount: number;
};

const CallReservedCard: FC<Props> = ({ amount }) => {
	return (
		<Card>
			<Stack spacing={1} sx={{ p: 3 }}>
				<Stack alignItems="center" direction="row" spacing={2}>
					<Avatar
						variant="rounded"
						sx={{
							backgroundColor: 'warning.alpha12',
							color: 'warning.main',
						}}
					>
						<SvgIcon>
							<PhonePausedIcon />
						</SvgIcon>
					</Avatar>
					<Typography variant="h5">{amount}</Typography>
				</Stack>
				<Typography color="text.secondary" variant="body2">
					Appels réservés
				</Typography>
			</Stack>
		</Card>
	);
};

export default CallReservedCard;
