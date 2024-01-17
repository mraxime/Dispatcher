import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	companyParamsSchema,
	type CreateCompanySchema,
	type UpdateCompanySchema,
} from 'src/lib/schemas/company.schema';
import type { CompanyParams } from 'src/lib/types/directus';
import { createCompany, deleteCompany, updateCompany } from 'src/server/actions/company.action';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful company actions.
 */
export const useCompanyActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const companyActions = useMemo(
		() => ({
			setParams: (params: CompanyParams) => {
				const newValue = companyParamsSchema.createSearchParams(params);
				searchParams.reset(newValue);
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CreateCompanySchema) => {
				const result = await createCompany(payload);
				toast.success('Entreprise créée !');
				return result;
			},

			update: async (id: number, payload: UpdateCompanySchema) => {
				const result = await updateCompany(id, payload);
				toast.success('Entreprise mise à jour !');
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer cette entreprise ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				await deleteCompany(id);
				toast.success('Entreprise supprimée !');
			},
		}),
		[],
	);

	return companyActions;
};
