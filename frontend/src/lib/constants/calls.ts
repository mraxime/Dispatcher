import type { ComponentType } from 'react';
import PhoneDisabledOutlinedIcon from '@mui/icons-material/PhoneDisabledOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import PhoneLockedOutlinedIcon from '@mui/icons-material/PhoneLockedOutlined';
import PhoneMissedOutlinedIcon from '@mui/icons-material/PhoneMissedOutlined';
import PhonePausedOutlinedIcon from '@mui/icons-material/PhonePausedOutlined';

export type CallStatus =
	| 'IN_PROGRESS'
	| 'PENDING'
	| 'COMPLETED'
	| 'CANCELED'
	| 'IMPOUNDED'
	| 'RESERVED';

export const CALL_STATUS_MAP: {
	[key in CallStatus]: {
		value: key;
		title: string;
		Icon: ComponentType;
	};
} = {
	PENDING: {
		value: 'PENDING',
		title: 'En attente',
		Icon: PhonePausedOutlinedIcon,
	},
	IN_PROGRESS: {
		value: 'IN_PROGRESS',
		title: 'En cours',
		Icon: PhoneInTalkOutlinedIcon,
	},
	IMPOUNDED: {
		value: 'IMPOUNDED',
		title: 'En fourrière',
		Icon: PhonePausedOutlinedIcon,
	},
	RESERVED: {
		value: 'RESERVED',
		title: 'Reservé',
		Icon: PhoneLockedOutlinedIcon,
	},
	COMPLETED: {
		value: 'COMPLETED',
		title: 'Terminé',
		Icon: PhoneDisabledOutlinedIcon,
	},
	CANCELED: {
		value: 'CANCELED',
		title: 'Annulé',
		Icon: PhoneMissedOutlinedIcon,
	},
};
