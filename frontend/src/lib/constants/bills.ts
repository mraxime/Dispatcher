export type BillStatus = 'UNPAID' | 'PAID';

export const BILL_STATUS_MAP: {
	[key in BillStatus]: {
		value: key;
		title: string;
	};
} = {
	PAID: {
		value: 'PAID',
		title: 'Payées',
	},
	UNPAID: {
		value: 'UNPAID',
		title: 'Non payées',
	},
};
