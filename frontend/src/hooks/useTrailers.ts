import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	trailerParamsSchema,
	type CreateTrailerSchema,
	type UpdateTrailerSchema,
} from 'src/lib/schemas/trailer.schema';
import type { TrailerParams } from 'src/lib/types/directus';
import { createTrailer, deleteTrailer, updateTrailer } from 'src/server/actions/trailer.action';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful trailer actions.
 */
export const useTrailerActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const trailerActions = useMemo(
		() => ({
			setParams: (params: TrailerParams) => {
				const newValue = trailerParamsSchema.createSearchParams(params);
				searchParams.reset(newValue);
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CreateTrailerSchema) => {
				const result = await createTrailer(payload);
				toast.success('Remorque créée !');
				return result;
			},

			update: async (id: number, payload: UpdateTrailerSchema) => {
				const result = await updateTrailer(id, payload);
				toast.success('Remorque mise à jour !');
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer cette remorque ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				await deleteTrailer(id);
				toast.success('Remorque supprimée !');
			},
		}),
		[],
	);

	return trailerActions;
};
