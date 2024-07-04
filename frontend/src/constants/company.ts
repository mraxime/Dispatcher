export const COMPANY_STATUS = ['active', 'inactive'] as const;

export const COMPANY_STATUS_MAP = {
	active: {
		value: 'active',
		title: 'Actif',
	},
	inactive: {
		value: 'inactive',
		title: 'Inactif',
	},
} satisfies {
	[key in CompanyStatus]: {
		value: key;
		title: string;
	};
};

export type CompanyStatus = (typeof COMPANY_STATUS)[number];
