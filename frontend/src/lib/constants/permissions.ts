import type { ComponentType } from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { Icons } from 'src/components/base/Icons';

export type PermissionAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export type PermissionGroup =
	| 'USER'
	| 'BILL'
	| 'CALENDAR'
	| 'CALL'
	| 'CLIENT'
	| 'COMPANY'
	| 'PRICE'
	| 'SERVICE'
	| 'TRAILER';

export const PERMISSION_ACTIONS_MAP: {
	[key in PermissionAction]: {
		value: key;
		title: string;
		Icon: ComponentType;
	};
} = {
	READ: {
		value: 'READ',
		title: 'Voir',
		Icon: VisibilityOutlinedIcon,
	},
	CREATE: {
		value: 'CREATE',
		title: 'Créer',
		Icon: Icons.add,
	},
	UPDATE: {
		value: 'UPDATE',
		title: 'Modifier',
		Icon: Icons.edit,
	},
	DELETE: {
		value: 'DELETE',
		title: 'Suprimer',
		Icon: Icons.delete,
	},
};

export const PERMISSION_GROUPS_MAP: {
	[key in PermissionGroup]: {
		value: key;
		title: string;
	};
} = {
	CALL: {
		value: 'CALL',
		title: 'Appel',
	},
	CALENDAR: {
		value: 'CALENDAR',
		title: 'Calendrier',
	},
	CLIENT: {
		value: 'CLIENT',
		title: 'Client',
	},
	COMPANY: {
		value: 'COMPANY',
		title: 'Entreprise',
	},
	BILL: {
		value: 'BILL',
		title: 'Facture',
	},
	PRICE: {
		value: 'PRICE',
		title: 'Prix',
	},
	TRAILER: {
		value: 'TRAILER',
		title: 'Remorque',
	},
	SERVICE: {
		value: 'SERVICE',
		title: 'Service',
	},
	USER: {
		value: 'USER',
		title: 'Utilisateur',
	},
};
