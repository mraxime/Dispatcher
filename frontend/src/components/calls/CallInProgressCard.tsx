import type { FC } from 'react';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

type Props = {
	amount: number;
};

export const CallInProgressCard: FC<Props> = ({ amount }) => {
	return (
		<Card>
			<Stack spacing={1} sx={{ p: 3 }}>
				<Stack alignItems="center" direction="row" spacing={2}>
					<Avatar
						variant="rounded"
						sx={{
							backgroundColor: 'success.alpha12',
							color: 'success.main',
						}}
					>
						<SvgIcon>
							<PhoneInTalkIcon />
						</SvgIcon>
					</Avatar>
					<Typography variant="h5">{amount}</Typography>
				</Stack>
				<Typography color="text.secondary" variant="body2">
					Appels en cours
				</Typography>
			</Stack>
		</Card>
	);
};

export default CallInProgressCard;
