import type { ComponentType } from 'react';
import type { AlertColor } from '@mui/material';
import { Icons } from 'src/components/base/Icons';

export const CALL_STATUS = [
	'pending',
	'in_progress',
	'impounded',
	'reserved',
	'completed',
	'canceled',
] as const;

export const CALL_STATUS_MAP = {
	pending: {
		value: 'pending',
		title: 'En attente',
		Icon: Icons.call,
		color: 'info',
		// Icon: PhonePausedOutlinedIcon,
	},
	in_progress: {
		value: 'in_progress',
		title: 'En cours',
		Icon: Icons.call,
		color: 'success',
		// Icon: PhoneInTalkOutlinedIcon,
	},
	impounded: {
		value: 'impounded',
		title: 'En fourrière',
		Icon: Icons.call,
		color: 'warning',
		// Icon: PhonePausedOutlinedIcon,
	},
	reserved: {
		value: 'reserved',
		title: 'Reservé',
		Icon: Icons.call,
		color: 'warning',
		// Icon: PhoneLockedOutlinedIcon,
	},
	completed: {
		value: 'completed',
		title: 'Complété',
		Icon: Icons.call,
		color: 'success',
		// Icon: PhoneDisabledOutlinedIcon,
	},
	canceled: {
		value: 'canceled',
		title: 'Annulé',
		Icon: Icons.call,
		color: 'error',
		// Icon: PhoneMissedOutlinedIcon,
	},
} satisfies {
	[key in CallStatus]: {
		value: key;
		title: string;
		color: AlertColor;
		Icon: ComponentType;
	};
};

export type CallStatus = (typeof CALL_STATUS)[number];
