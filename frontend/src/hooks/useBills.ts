import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	billParamsSchema,
	type CreateBillSchema,
	type UpdateBillSchema,
} from 'src/lib/schemas/bill.schema';
import type { BillParams } from 'src/lib/types/directus';
import { createBill, deleteBill, updateBill } from 'src/server/actions/bill.action';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful bill actions.
 */
export const useBillActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const billActions = useMemo(
		() => ({
			setParams: (params: BillParams) => {
				const newValue = billParamsSchema.createSearchParams(params);
				searchParams.reset(newValue);
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CreateBillSchema) => {
				const result = await createBill(payload);
				toast.success('Facture créée !');
				return result;
			},

			update: async (id: number, payload: UpdateBillSchema) => {
				const result = await updateBill(id, payload);
				toast.success('Facture mise à jour !');
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer cette facture ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				await deleteBill(id);
				toast.success('Facture supprimée !');
			},
		}),
		[],
	);

	return billActions;
};
