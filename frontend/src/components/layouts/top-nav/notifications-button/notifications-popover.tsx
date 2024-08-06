import type { FC } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';

import { Icons } from 'src/components/base/Icons';
import type { Notification } from './types';

const renderContent = (notification: Notification): JSX.Element | null => {
	switch (notification.type) {
		case 'job_add': {
			const createdAt = format(notification.createdAt, 'MMM dd, h:mm a');

			return (
				<>
					<ListItemAvatar sx={{ mt: 0.5 }}>
						<Avatar src={notification.avatar}>
							<SvgIcon>
								<Icons.user />
							</SvgIcon>
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={
							<Box
								sx={{
									alignItems: 'center',
									display: 'flex',
									flexWrap: 'wrap',
								}}
							>
								<Typography sx={{ mr: 0.5 }} variant="subtitle2">
									{notification.author}
								</Typography>
								<Typography sx={{ mr: 0.5 }} variant="body2">
									added a new job
								</Typography>
								<Link href="#" underline="always" variant="body2">
									{notification.job}
								</Link>
							</Box>
						}
						secondary={
							<Typography color="text.secondary" variant="caption">
								{createdAt}
							</Typography>
						}
						sx={{ my: 0 }}
					/>
				</>
			);
		}
		case 'new_feature': {
			const createdAt = format(notification.createdAt, 'MMM dd, h:mm a');

			return (
				<>
					<ListItemAvatar sx={{ mt: 0.5 }}>
						<Avatar>
							<SvgIcon>
								<Icons.chat />
							</SvgIcon>
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={
							<Box
								sx={{
									alignItems: 'center',
									display: 'flex',
									flexWrap: 'wrap',
								}}
							>
								<Typography variant="subtitle2" sx={{ mr: 0.5 }}>
									New feature!
								</Typography>
								<Typography variant="body2">{notification.description}</Typography>
							</Box>
						}
						secondary={
							<Typography color="text.secondary" variant="caption">
								{createdAt}
							</Typography>
						}
						sx={{ my: 0 }}
					/>
				</>
			);
		}
		case 'company_created': {
			const createdAt = format(notification.createdAt, 'MMM dd, h:mm a');

			return (
				<>
					<ListItemAvatar sx={{ mt: 0.5 }}>
						<Avatar src={notification.avatar}>
							<SvgIcon>
								<Icons.user />
							</SvgIcon>
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={
							<Box
								sx={{
									alignItems: 'center',
									display: 'flex',
									flexWrap: 'wrap',
									m: 0,
								}}
							>
								<Typography sx={{ mr: 0.5 }} variant="subtitle2">
									{notification.author}
								</Typography>
								<Typography sx={{ mr: 0.5 }} variant="body2">
									created
								</Typography>
								<Link href="#" underline="always" variant="body2">
									{notification.company}
								</Link>
							</Box>
						}
						secondary={
							<Typography color="text.secondary" variant="caption">
								{createdAt}
							</Typography>
						}
						sx={{ my: 0 }}
					/>
				</>
			);
		}
		default: {
			return null;
		}
	}
};

type Props = {
	anchorEl: null | Element;
	notifications: Notification[];
	onClose?: () => void;
	onMarkAllAsRead?: () => void;
	onRemoveOne?: (id: string) => void;
	open?: boolean;
};

const NotificationsPopover: FC<Props> = (props) => {
	const {
		anchorEl,
		notifications,
		onClose,
		onMarkAllAsRead,
		onRemoveOne,
		open = false,
		...other
	} = props;

	const isEmpty = notifications.length === 0;

	return (
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{
				horizontal: 'left',
				vertical: 'bottom',
			}}
			disableScrollLock
			onClose={onClose}
			open={open}
			PaperProps={{ sx: { width: 380 } }}
			{...other}
		>
			<Stack
				alignItems="center"
				direction="row"
				justifyContent="space-between"
				sx={{
					px: 3,
					py: 2,
				}}
			>
				<Typography color="inherit" variant="h6">
					Notifications
				</Typography>
				<Tooltip title={undefined /* Tout marquer comme lu */}>
					<IconButton onClick={onMarkAllAsRead} size="small" color="inherit">
						<SvgIcon fontSize="small">
							<Icons.mail />
						</SvgIcon>
					</IconButton>
				</Tooltip>
			</Stack>
			{isEmpty ? (
				<Box p={2} pt={0}>
					<Typography variant="caption" color="dimgrey">
						Aucune notification
					</Typography>
				</Box>
			) : (
				<List disablePadding>
					{notifications.map((notification) => (
						<ListItem
							divider
							key={notification.id}
							sx={{
								alignItems: 'flex-start',
								'&:hover': {
									backgroundColor: 'action.hover',
								},
								'& .MuiListItemSecondaryAction-root': {
									top: '24%',
								},
							}}
							secondaryAction={
								<Tooltip title="Remove">
									<IconButton
										edge="end"
										onClick={() => onRemoveOne?.(notification.id)}
										size="small"
									>
										<SvgIcon>
											<Icons.close />
										</SvgIcon>
									</IconButton>
								</Tooltip>
							}
						>
							{renderContent(notification)}
						</ListItem>
					))}
				</List>
			)}
		</Popover>
	);
};

export default NotificationsPopover;
