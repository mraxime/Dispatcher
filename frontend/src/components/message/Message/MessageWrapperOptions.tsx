import { useRef, type FC } from 'react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {
	ButtonGroup,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Icons } from 'src/components/base/Icons';
import useDisclosure from 'src/hooks/useDisclosure';
import type { Message } from 'src/types';

type Props = {
	message: Message;
};

const MessageWrapperOptions: FC<Props> = ({ message }) => {
	const optionsButtonRef = useRef<HTMLButtonElement>(null);
	const { isOpen, open, close } = useDisclosure();

	const handleFileDownload = () => {
		const imageUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${message.file?.id}`;
		const downloadUrl = `${imageUrl}&download`;

		window.location.href = downloadUrl;
		close();
	};

	if (!message.file) return null;

	return (
		<>
			<Tooltip title="Options" placement="left">
				<ButtonGroup variant="contained">
					<IconButton
						ref={optionsButtonRef}
						onClick={open}
						sx={{
							transition: '0.2s',
							borderRadius: 2,
							bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
							':hover': {
								bgcolor: (theme) => alpha(theme.palette.primary.main, 0.8),
							},
						}}
					>
						<Icons.moreVertical />
					</IconButton>
				</ButtonGroup>
			</Tooltip>
			<Menu
				anchorEl={optionsButtonRef.current}
				open={isOpen}
				onClose={close}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				sx={{ mt: 1 }}
			>
				<MenuItem onClick={handleFileDownload}>
					<ListItemIcon>
						<FileDownloadOutlinedIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>Télécharger</ListItemText>
				</MenuItem>
			</Menu>
		</>
	);
};

export default MessageWrapperOptions;
