'use client';

import type { FC } from 'react';
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

type Props = {
	amount: number;
};

export const CallCanceledCard: FC<Props> = ({ amount }) => {
	return (
		<Card>
			<Stack spacing={1} sx={{ p: 3 }}>
				<Stack alignItems="center" direction="row" spacing={2}>
					<Avatar
						variant="rounded"
						sx={{
							backgroundColor: 'error.alpha12',
							color: 'error.main',
						}}
					>
						<SvgIcon>
							<PhoneMissedIcon />
						</SvgIcon>
					</Avatar>
					<Typography variant="h5">{amount}</Typography>
				</Stack>
				<Typography color="text.secondary" variant="body2">
					Appels annulés
				</Typography>
			</Stack>
		</Card>
	);
};

export default CallCanceledCard;
