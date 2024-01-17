import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	serviceParamsSchema,
	type CreateServiceSchema,
	type UpdateServiceSchema,
} from 'src/lib/schemas/service.schema';
import type { ServiceParams } from 'src/lib/types/directus';
import { createService, deleteService, updateService } from 'src/server/actions/service.action';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful service actions.
 */
export const useServiceActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const serviceActions = useMemo(
		() => ({
			setParams: (params: ServiceParams) => {
				const newValue = serviceParamsSchema.createSearchParams(params);
				searchParams.reset(newValue);
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CreateServiceSchema) => {
				const result = await createService(payload);
				toast.success('Service créé !');
				return result;
			},

			update: async (id: number, payload: UpdateServiceSchema) => {
				const result = await updateService(id, payload);
				toast.success('Service mis à jour !');
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer ce service ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				await deleteService(id);
				toast.success('Service supprimé !');
			},
		}),
		[],
	);

	return serviceActions;
};
