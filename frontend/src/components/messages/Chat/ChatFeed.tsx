import { useLayoutEffect, useRef, type FC } from 'react';
import { Stack } from '@mui/material';

import Message from 'src/components/messages/Message';
import type { Message as MessageType } from 'src/lib/types/directus';

const SCROLL_BOTTOM = (element?: HTMLDivElement, options: ScrollToOptions = {}) => {
	if (!element) return;

	const scrollHeight = element.scrollHeight;
	element.scrollTo({ top: scrollHeight, behavior: 'smooth', ...options });
};

type Props = {
	messages: MessageType[];
};

const ChatFeed: FC<Props> = ({ messages }) => {
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		if (messagesContainerRef.current) {
			SCROLL_BOTTOM(messagesContainerRef.current, { behavior: 'smooth' });
		}
	}, [messages]);

	useLayoutEffect(() => {
		if (messagesContainerRef.current) {
			SCROLL_BOTTOM(messagesContainerRef.current, { behavior: 'auto' });
		}
	}, []);

	return (
		<Stack height="100%" flex={1} pt={1} pb={2} overflow="auto" ref={messagesContainerRef}>
			{messages?.map((message) => <Message message={message} isMe={false} key={message.id} />)}
		</Stack>
	);
};

export default ChatFeed;
