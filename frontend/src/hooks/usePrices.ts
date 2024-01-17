import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	priceParamsSchema,
	type CreatePriceSchema,
	type UpdatePriceSchema,
} from 'src/lib/schemas/price.schema';
import type { PriceParams } from 'src/lib/types/directus';
import { createPrice, deletePrice, updatePrice } from 'src/server/actions/price.action';
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
				const newValue = priceParamsSchema.createSearchParams(params);
				searchParams.reset(newValue);
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CreatePriceSchema) => {
				const result = await createPrice(payload);
				toast.success('Prix créé !');
				return result;
			},

			update: async (id: number, payload: UpdatePriceSchema) => {
				const result = await updatePrice(id, payload);
				toast.success('Prix mis à jour !');
				return result;
			},

			delete: async (id: number) => {
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
