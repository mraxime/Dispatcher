import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createCompany, deleteCompany, updateCompany } from 'src/server/actions/company';
import type { CompanyInput, CompanyParams } from 'src/types';
import { companyParamsSchema } from 'src/validations/company';
import { removeDefaultParams } from 'src/validations/utils';
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
				searchParams.reset(removeDefaultParams(params, companyParamsSchema));
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CompanyInput) => {
				const result = await createCompany(payload);
				toast.success('Entreprise créée !');
				return result;
			},

			update: async (id: string, payload: Partial<CompanyInput>) => {
				const result = await updateCompany(id, payload);
				toast.success('Entreprise mise à jour !');
				return result;
			},

			delete: async (id: string) => {
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
