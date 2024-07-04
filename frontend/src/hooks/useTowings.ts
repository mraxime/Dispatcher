import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createTowing, deleteTowing, updateTowing } from 'src/server/actions/towing ';
import type { TowingInput, TowingParams } from 'src/types';
import { towingParamsSchema } from 'src/validations/towing';
import { removeDefaultParams } from 'src/validations/utils';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful towing actions.
 */
export const useTowingActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const towingActions = useMemo(
		() => ({
			setParams: (params: TowingParams) => {
				searchParams.reset(removeDefaultParams(params, towingParamsSchema));
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: TowingInput) => {
				const result = await createTowing(payload);
				toast.success('Remorque créée !');
				return result;
			},

			update: async (id: string, payload: Partial<TowingInput>) => {
				const result = await updateTowing(id, payload);
				toast.success('Remorque mise à jour !');
				return result;
			},

			delete: async (id: string) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer cette remorque ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				await deleteTowing(id);
				toast.success('Remorque supprimée !');
			},
		}),
		[],
	);

	return towingActions;
};
