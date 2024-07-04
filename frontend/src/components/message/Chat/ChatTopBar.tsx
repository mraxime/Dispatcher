import type { FC, ReactElement } from 'react';
import { Paper, Stack, Typography } from '@mui/material';

type Props = {
	title?: ReactElement;
	subtitle?: ReactElement;
};

const ChatTopBar: FC<Props> = ({ title = 'Conversation', subtitle }) => {
	return (
		<Paper square sx={{ p: 2, zIndex: 'appBar' }}>
			<Stack direction="row" spacing={2}>
				{/*<UserAvatar userId={userId} />*/}
				<div>
					<Typography variant="h6">{title}</Typography>
					{subtitle && <Typography variant="caption">{subtitle}</Typography>}
				</div>
			</Stack>
		</Paper>
	);
};

export default ChatTopBar;
