'use client';

import type { FC, ReactElement } from 'react';
import { Box, Stack } from '@mui/material';

import type { Message } from 'src/lib/types/directus';
import ChatFeed from './ChatFeed';
import ChatPrompt from './ChatPrompt';
import ChatTopBar from './ChatTopBar';
import type { ChatSubmitData } from './types';

type Props = {
	title?: ReactElement;
	subtitle?: ReactElement;
	messages: Message[];
	onSubmit?: (message: ChatSubmitData) => Promise<void>;
};

const Chat: FC<Props> = ({ title, subtitle, messages, onSubmit }) => {
	return (
		<Stack height="100%">
			<ChatTopBar title={title} subtitle={subtitle} />
			<Box flex={1} overflow="hidden">
				<ChatFeed messages={messages} />
			</Box>
			<ChatPrompt onSubmit={onSubmit} />
		</Stack>
	);
};

export default Chat;
