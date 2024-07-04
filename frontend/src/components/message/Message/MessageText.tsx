import type { FC } from 'react';
import { Typography } from '@mui/material';
import type { Message } from 'src/types';
import MessageWrapper from './MessageWrapper';

type Props = {
	message: Message;
	isMe?: boolean;
};

const MessageText: FC<Props> = ({ message, isMe }) => {
	return (
		<MessageWrapper message={message} isMe={isMe}>
			<Typography color={'text.secondary'}>{message.content}</Typography>
		</MessageWrapper>
	);
};

export default MessageText;
