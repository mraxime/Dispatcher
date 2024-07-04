import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createBill, deleteBill, updateBill } from 'src/server/actions/bill';
import type { BillInput, BillParams } from 'src/types';
import { billParamsSchema } from 'src/validations/bill';
import { removeDefaultParams } from 'src/validations/utils';
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
				searchParams.reset(removeDefaultParams(params, billParamsSchema));
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: BillInput) => {
				const result = await createBill(payload);
				toast.success('Facture créée !');
				return result;
			},

			update: async (id: string, payload: Partial<BillInput>) => {
				const result = await updateBill(id, payload);
				toast.success('Facture mise à jour !');
				return result;
			},

			delete: async (id: string) => {
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
