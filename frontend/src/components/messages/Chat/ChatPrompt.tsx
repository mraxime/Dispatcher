import { useRef, type FC } from 'react';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { IconButton, InputBase, Paper, Stack, SvgIcon, Tooltip } from '@mui/material';

import FileUploader from 'src/components/base/FileUploader';
import { Icons } from 'src/components/base/Icons';
import useDisclosure from 'src/hooks/useDisclosure';
import type { ChatSubmitData } from './types';

type Props = {
	onSubmit?: (message: ChatSubmitData) => Promise<void>;
};

const ChatPrompt: FC<Props> = ({ onSubmit }) => {
	const { isOpen, open, close } = useDisclosure();

	const inputRef = useRef<HTMLInputElement>(null);

	const handleMessageSubmit = async () => {
		const inputElement = inputRef.current;
		if (!onSubmit || !inputElement) return;
		if (inputElement.value.length === 0) return inputElement.focus();

		await onSubmit({ content: inputElement.value, attachement: undefined });
	};

	const handleFileSubmit = async (files: File[]) => {
		const inputElement = inputRef.current;
		if (!onSubmit || !inputElement) return;
		if (inputElement.value.length === 0) return inputElement.focus();

		await onSubmit({ content: '', attachement: files[0] });
	};

	return (
		<Paper square sx={{ p: 3, zIndex: 'appBar' }} component="form" onSubmit={handleMessageSubmit}>
			<FileUploader
				isOpen={isOpen}
				onClose={close}
				dialogTitle="Envoyer un fichier"
				onSave={handleFileSubmit}
			/>
			<Stack direction="row" spacing={2}>
				{/*<UserAvatar userId={session?.id} />*/}
				<InputBase
					inputRef={inputRef}
					sx={{ flex: 1, bgcolor: 'background.default', p: 1, borderRadius: 1 }}
					placeholder="Envoyer un message"
				/>
				<Tooltip title="Partager un fichier">
					<IconButton onClick={open} color="inherit" size="large">
						<AddPhotoAlternateOutlinedIcon sx={{ width: 26, height: 26 }} />
					</IconButton>
				</Tooltip>
				<Tooltip title="Envoyer">
					<IconButton color="inherit" size="large" type="submit">
						<SvgIcon fontSize="small">
							<Icons.send />
						</SvgIcon>
					</IconButton>
				</Tooltip>
			</Stack>
		</Paper>
	);
};

export default ChatPrompt;
