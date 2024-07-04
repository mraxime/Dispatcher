import type { FC } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { usePopover } from 'src/hooks/usePopover';
import type { User } from 'src/types';
import AccountButtonPopover from './AccountButtonPopover';

type Props = {
	user: User;
};

const AccountButton: FC<Props> = ({ user }) => {
	const popover = usePopover<HTMLButtonElement>();

	return (
		<>
			<Tooltip title="Session">
				<Box
					component={ButtonBase}
					onClick={popover.open}
					ref={popover.anchorRef}
					sx={{
						alignItems: 'center',
						display: 'flex',
						borderWidth: 2,
						borderStyle: 'solid',
						borderColor: 'divider',
						height: 40,
						width: 40,
						borderRadius: '50%',
					}}
				>
					<Avatar
						sx={{
							height: 32,
							width: 32,
						}}
					>
						<AccountCircleIcon />
					</Avatar>
				</Box>
			</Tooltip>
			<AccountButtonPopover
				user={user}
				anchorEl={popover.anchorRef.current}
				onClose={popover.close}
				open={popover.isOpen}
			/>
		</>
	);
};

export default AccountButton;
