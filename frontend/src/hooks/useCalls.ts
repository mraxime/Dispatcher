import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	callParamsSchema,
	type CreateCallSchema,
	type UpdateCallSchema,
} from 'src/lib/schemas/call.schema';
import type { CallParams } from 'src/lib/types/directus';
import { createCall, deleteCall, updateCall } from 'src/server/actions/call.action';
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
				const newValue = callParamsSchema.createSearchParams(params);
				searchParams.reset(newValue);
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CreateCallSchema) => {
				const result = await createCall(payload);
				toast.success("Formulaire d'appel créé !");
				return result;
			},

			update: async (id: number, payload: UpdateCallSchema) => {
				const result = await updateCall(id, payload);
				toast.success("Formulaire d'appel mis à jour !");
				return result;
			},

			delete: async (id: number) => {
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
