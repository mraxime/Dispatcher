import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createClient, deleteClient, updateClient } from 'src/server/actions/client';
import type { ClientInput, ClientParams } from 'src/types';
import { clientParamsSchema } from 'src/validations/client';
import { removeDefaultParams } from 'src/validations/utils';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful client actions.
 */
export const useClientActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const clientActions = useMemo(
		() => ({
			setParams: (params: ClientParams) => {
				searchParams.reset(removeDefaultParams(params, clientParamsSchema));
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: ClientInput) => {
				const result = await createClient(payload);
				toast.success('Client créé !');
				return result;
			},

			update: async (id: string, payload: Partial<ClientInput>) => {
				const result = await updateClient(id, payload);
				toast.success('Client mis à jour !');
				return result;
			},

			delete: async (id: string) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer ce client ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				await deleteClient(id);
				toast.success('Client supprimé !');
			},
		}),
		[],
	);

	return clientActions;
};
