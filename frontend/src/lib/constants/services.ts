export type ServiceStatus = 'ACTIVE' | 'INACTIVE';

export const SERVICE_STATUS_MAP: {
	[key in ServiceStatus]: {
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
