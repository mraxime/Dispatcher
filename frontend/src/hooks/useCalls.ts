import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createCall, deleteCall, updateCall } from 'src/server/actions/call';
import type { CallInput, CallParams } from 'src/types';
import { callParamsSchema } from 'src/validations/call';
import { removeDefaultParams } from 'src/validations/utils';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful call actions.
 */
export const useCallActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const callActions = useMemo(
		() => ({
			setParams: (params: CallParams) => {
				searchParams.reset(removeDefaultParams(params, callParamsSchema));
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CallInput) => {
				const result = await createCall(payload);
				toast.success("Formulaire d'appel créé !");
				return result;
			},

			update: async (id: string, payload: Partial<CallInput>) => {
				const result = await updateCall(id, payload);
				toast.success("Formulaire d'appel mis à jour !");
				return result;
			},

			delete: async (id: string) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer ce formulaire d'appel ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				await deleteCall(id);
				toast.success("Formulaire d'appel supprimé !");
			},
		}),
		[],
	);

	return callActions;
};
