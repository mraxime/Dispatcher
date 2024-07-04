import type { FC } from 'react';
import type { Message } from 'src/types';
import MessageWrapper from './MessageWrapper';

type Props = {
	message: Message;
	isMe?: boolean;
};

const MessageVideo: FC<Props> = ({ message, isMe }) => (
	<MessageWrapper message={message} isMe={isMe}>
		<video
			style={{ overflow: 'hidden', borderRadius: 8 }}
			controls
			src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${message.file?.id}?key=small`}
		/>
	</MessageWrapper>
);

export default MessageVideo;
