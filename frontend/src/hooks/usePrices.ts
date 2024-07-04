import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createPrice, deletePrice, updatePrice } from 'src/server/actions/price';
import type { PriceInput, PriceParams } from 'src/types';
import { priceParamsSchema } from 'src/validations/price';
import { removeDefaultParams } from 'src/validations/utils';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful price actions.
 */
export const usePriceActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const priceActions = useMemo(
		() => ({
			setParams: (params: PriceParams) => {
				searchParams.reset(removeDefaultParams(params, priceParamsSchema));
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: PriceInput) => {
				const result = await createPrice(payload);
				toast.success('Prix créé !');
				return result;
			},

			update: async (id: string, payload: Partial<PriceInput>) => {
				const result = await updatePrice(id, payload);
				toast.success('Prix mis à jour !');
				return result;
			},

			delete: async (id: string) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer ce prix ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				await deletePrice(id);
				toast.success('Prix supprimé !');
			},
		}),
		[],
	);

	return priceActions;
};
