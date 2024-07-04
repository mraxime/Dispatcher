import type { FC } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import type { Message } from 'src/types';
import MessageWrapper from './MessageWrapper';

type Props = {
	message: Message;
	isMe?: boolean;
};

const MessageImage: FC<Props> = ({ message, isMe }) => {
	const handle = useFullScreenHandle();
	const isFullScreen = handle.active;
	const imageUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${message.file?.id}`;
	const imageThumbnailUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${message.file?.id}?key=small`;

	return (
		<MessageWrapper message={message} isMe={isMe}>
			<FullScreen handle={handle}>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					style={{
						objectFit: 'contain',
						width: '100%',
						height: '100%',
						borderRadius: 8,
						maxWidth: isFullScreen ? undefined : 352,
						maxHeight: isFullScreen ? undefined : 192,
						cursor: isFullScreen ? undefined : 'zoom-in',
					}}
					alt={message.file?.title ?? undefined}
					src={isFullScreen ? imageUrl : imageThumbnailUrl}
					onClick={isFullScreen ? undefined : handle.enter}
				/>
			</FullScreen>
		</MessageWrapper>
	);
};

export default MessageImage;
