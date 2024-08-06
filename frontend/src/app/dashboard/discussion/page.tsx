'use client';

import { Box, Container, Paper, Stack, SvgIcon, Typography } from '@mui/material';
import { Clock as ClockIcon } from 'react-feather';

import Chat from 'src/components/messages/Chat';
import UsersAsideList from 'src/components/users/UsersAsideList';
import { useMessages } from 'src/hooks/useMessages';
import { useUsers } from 'src/hooks/useUsers';
import type { MessageParams, UserParams } from 'src/lib/types/directus';

const ChatPage = () => {
	const params: UserParams = {
		page: 1,
		limit: 10,
		fields: ['*'],
		filter: { status: { _eq: 'active' } },
	};

	const messageParams: MessageParams = {
		fields: ['*', { sender: ['*'], receiver: ['*'], file: ['*'] }],
		limit: 50,
	};

	const users = useUsers(params);
	const messages = useMessages(messageParams);

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
						<UsersAsideList data={users.data} />
					</Box>
					<Box flexGrow={1} height="79vh" sx={{ backgroundColor: 'background.default' }}>
						<Chat messages={messages.data} />
					</Box>
				</Stack>
			</Paper>
		</Container>
	);
};

export default ChatPage;
