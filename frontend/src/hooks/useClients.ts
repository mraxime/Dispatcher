import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	clientParamsSchema,
	type CreateClientSchema,
	type UpdateClientSchema,
} from 'src/lib/schemas/client.schema';
import type { ClientParams } from 'src/lib/types/directus';
import { createClient, deleteClient, updateClient } from 'src/server/actions/client.action';
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
				const newValue = clientParamsSchema.createSearchParams(params);
				searchParams.reset(newValue);
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CreateClientSchema) => {
				const result = await createClient(payload);
				toast.success('Client créé !');
				return result;
			},

			update: async (id: number, payload: UpdateClientSchema) => {
				const result = await updateClient(id, payload);
				toast.success('Client mis à jour !');
				return result;
			},

			delete: async (id: number) => {
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
