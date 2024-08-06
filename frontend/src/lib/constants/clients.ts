export type ClientStatus = 'ACTIVE' | 'INACTIVE';

export const CLIENT_STATUS_MAP: {
	[key in ClientStatus]: {
		value: key;
		title: string;
	};
} = {
	ACTIVE: {
		value: 'ACTIVE',
		title: 'Actifs',
	},
	INACTIVE: {
		value: 'INACTIVE',
		title: 'Inactifs',
	},
};
