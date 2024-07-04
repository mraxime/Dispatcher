export const BILL_STATUS = ['pending', 'processing', 'paid', 'canceled'] as const;

export const BILL_STATUS_MAP = {
	pending: {
		value: 'pending',
		title: 'En attente',
	},
	processing: {
		value: 'processing',
		title: 'En transaction',
	},
	paid: {
		value: 'paid',
		title: 'Payée',
	},
	canceled: {
		value: 'canceled',
		title: 'Annulée',
	},
} satisfies {
	[key in BillStatus]: {
		value: key;
		title: string;
	};
};

export type BillStatus = (typeof BILL_STATUS)[number];
