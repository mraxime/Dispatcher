import { Box, Container, Paper, Stack, SvgIcon, Typography } from '@mui/material';
import { Clock as ClockIcon } from 'react-feather';

import Chat from 'src/components/messages/Chat';
import UsersAsideList from 'src/components/users/UsersAsideList';
import type { MessageParams, UserParams } from 'src/lib/types/directus';
import { getMessages } from 'src/server/actions/message.action';
import { getUsers } from 'src/server/actions/user.action';

const ChatPage = async () => {
	const userParams: UserParams = {
		page: 1,
		limit: 10,
		fields: ['*'],
		filter: { status: { _eq: 'active' } },
	};

	const messageParams: MessageParams = {
		fields: ['*', { sender: ['*'], receiver: ['*'], file: ['*'] }],
		limit: 50,
	};

	const [users, messages] = await Promise.all([getUsers(userParams), getMessages(messageParams)]);

	return (
		<Container maxWidth="xl">
			<Typography variant="caption" display="flex" gap={0.5} alignItems="center" gutterBottom>
				<SvgIcon fontSize="inherit">
					<ClockIcon />
				</SvgIcon>
				En développement...
			</Typography>
			<Paper variant="outlined">
				<Stack direction="row">
					<Box maxWidth={350} flexShrink={0} width="100%">
						<UsersAsideList data={users} />
					</Box>
					<Box flexGrow={1} height="79vh" sx={{ backgroundColor: 'background.default' }}>
						<Chat messages={messages} />
					</Box>
				</Stack>
			</Paper>
		</Container>
	);
};

export default ChatPage;
