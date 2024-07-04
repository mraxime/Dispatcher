import type { FC, ReactNode } from 'react';
import { Avatar, Box, Fade, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { formatDistance } from 'date-fns';
import { frCA } from 'date-fns/locale';
import useDisclosure from 'src/hooks/useDisclosure';
import type { Message } from 'src/types';
import { getInitials } from 'src/utils';
import MessageWrapperOptions from './MessageWrapperOptions';

type Props = {
	message: Message;
	isMe?: boolean;
	children?: ReactNode;
};

const MessageWrapper: FC<Props> = ({ message, isMe, children }) => {
	const {
		isOpen: isOptionsButtonVisible,
		open: showOptionsButton,
		close: hideOptionsButton,
	} = useDisclosure();

	return (
		<Stack
			position="relative"
			direction="row"
			spacing={2}
			px={2}
			py={3}
			onMouseEnter={showOptionsButton}
			onMouseLeave={hideOptionsButton}
			sx={{
				':hover': {
					bgcolor: (theme) => alpha(theme.palette.background.paper, 0.5),
				},
			}}
		>
			<Avatar alt="User">
				{getInitials(`${message.sender?.firstName} ${message.sender?.lastName}`)}
			</Avatar>
			<Stack flexGrow={1}>
				<Stack spacing={1} direction="row" alignItems="baseline">
					<Typography fontWeight="bold" color={isMe ? 'primary.main' : 'text.primary'}>
						{isMe ? 'Moi' : `${message.sender?.firstName} ${message.sender?.lastName}`}
					</Typography>
					<Typography right={20} variant="caption" color="text.disabled">
						{formatDistance(message.createdAt, new Date(), {
							addSuffix: true,
							locale: frCA,
						})}
					</Typography>
					<Box position="absolute" right={16} top={-16}>
						<Fade in={isOptionsButtonVisible}>
							<div>
								<MessageWrapperOptions message={message} />
							</div>
						</Fade>
					</Box>
				</Stack>
				<Box mt={1}>{children}</Box>
			</Stack>
		</Stack>
	);
};

export default MessageWrapper;
