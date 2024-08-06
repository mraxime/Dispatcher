import type { FC } from 'react';

import type { Message as MessageType } from 'src/lib/types/directus';
import MessageAudio from './MessageAudio';
import MessageImage from './MessageImage';
import MessageText from './MessageText';
import MessageVideo from './MessageVideo';

type Props = {
	message: MessageType;
	isMe?: boolean;
};

const Message: FC<Props> = ({ message, isMe }) => {
	if (message.file?.type?.startsWith('image/')) {
		return <MessageImage message={message} isMe={isMe} />;
	}

	if (message.file?.type?.startsWith('video/')) {
		return <MessageVideo message={message} isMe={isMe} />;
	}

	if (message.file?.type?.startsWith('audio/')) {
		return <MessageAudio message={message} isMe={isMe} />;
	}

	return <MessageText message={message} isMe={isMe} />;
};

export default Message;
