import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createService, deleteService, updateService } from 'src/server/actions/service';
import type { ServiceInput, ServiceParams } from 'src/types';
import { serviceParamsSchema } from 'src/validations/service';
import { removeDefaultParams } from 'src/validations/utils';
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
				searchParams.reset(removeDefaultParams(params, serviceParamsSchema));
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: ServiceInput) => {
				const result = await createService(payload);
				toast.success('Service créé !');
				return result;
			},

			update: async (id: string, payload: Partial<ServiceInput>) => {
				const result = await updateService(id, payload);
				toast.success('Service mis à jour !');
				return result;
			},

			delete: async (id: string) => {
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
