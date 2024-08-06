import type { FC } from 'react';
import { DropzoneDialog, type DropzoneDialogProps } from 'mui-file-dropzone';
import prettyBytes from 'pretty-bytes';

type Props = {
	isOpen: boolean;
	onClose: () => void;
} & DropzoneDialogProps;

const FileUploader: FC<Props> = ({ isOpen, onClose, ...props }) => {
	return (
		<DropzoneDialog
			open={isOpen}
			onClose={onClose}
			fileObjects={undefined}
			maxFileSize={5 * 1000 * 1000 * 1000} // 5Go
			acceptedFiles={[
				// MIME types list: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
				'audio/aac',
				'audio/mpeg',
				'audio/ogg',
				'audio/wav',
				'audio/webm',
				'image/avif',
				'image/gif',
				'image/jpeg',
				'image/png',
				'image/svg+xml',
				'image/webp',
				'video/mp4',
				'video/mpeg',
				'video/webm',
				'video/x-msvideo',
			]}
			dialogTitle="Uploader de fichier"
			dropzoneText="Cliquez ou glissez un fichier ici"
			previewText="Preview:"
			submitButtonText="Envoyer"
			cancelButtonText="Annuler"
			filesLimit={1}
			getFileAddedMessage={(fileName) => `Fichier ${fileName} sélectionné.`}
			getFileRemovedMessage={(fileName) => `Fichier ${fileName} supprimé.`}
			alertSnackbarProps={{
				autoHideDuration: 5000,
				disableWindowBlurListener: true,
			}}
			showAlerts={['error', 'warning']}
			getDropRejectMessage={(file, _accpetedFiles, maxFileSize) =>
				`Le fichier ${file.name} n'a pas pu être accepté. (Limite: ${prettyBytes(maxFileSize)})`
			}
			getFileLimitExceedMessage={(filesLimit) =>
				`La limite est de ${filesLimit} ${filesLimit > 1 ? 'fichiers' : 'fichier'}`
			}
			{...props}
		/>
	);
};

export default FileUploader;
