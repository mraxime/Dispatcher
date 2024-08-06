import type { FC } from 'react';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';

import { Icons } from 'src/components/base/Icons';
import { usePopover } from 'src/hooks/usePopover';
import NotificationsPopover from './notifications-popover';

const NotificationsButton: FC = () => {
	const popover = usePopover<HTMLButtonElement>();

	return (
		<>
			<Tooltip title="Notifications">
				<IconButton ref={popover.anchorRef} onClick={popover.open}>
					<Badge color="error" badgeContent={undefined}>
						<SvgIcon fontSize="small">
							<Icons.notification />
						</SvgIcon>
					</Badge>
				</IconButton>
			</Tooltip>
			<NotificationsPopover
				anchorEl={popover.anchorRef.current}
				notifications={[]}
				onClose={popover.close}
				open={popover.isOpen}
			/>
		</>
	);
};

export default NotificationsButton;
