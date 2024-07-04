import { Box, Container, Paper, Stack, SvgIcon, Typography } from '@mui/material';
import { Clock as ClockIcon } from 'react-feather';
import Chat from 'src/components/message/Chat';
import UsersAsideList from 'src/components/user/UsersAsideList';
import { getMessages, getUsers } from 'src/server/services';
import type { MessageParams, UserParams } from 'src/types';
import { pageGuard } from '../guard';

const ChatPage = async () => {
	await pageGuard('messages:read');

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
