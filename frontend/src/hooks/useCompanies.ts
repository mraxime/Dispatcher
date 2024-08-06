import { useMemo, useState } from 'react';
import {
	createItem,
	deleteItem,
	readItems,
	updateItem,
	updateUser,
	type Query,
} from '@directus/sdk';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type { CreateCompanySchema, UpdateCompanySchema } from 'src/lib/schemas/companies';
import type { Company, DirectusSchema } from 'src/lib/types/directus';

type Params = Query<DirectusSchema, Company>;

/**
 * Hook to provide companies data and actions.
 * It allows components using this hook to access the same cache, avoiding unnecessary fetches.
 */
export const useCompanies = (initialParams?: Params) => {
	const [params, setParams] = useState(initialParams);

	const companiesCache = useSWR(['companies', params], ([, params]) =>
		api.request(readItems('companies', params)),
	);

	const companyActions = useMemo(
		() => ({
			setParams,
			revalidate: () => companiesCache.mutate(),

			create: async (payload: CreateCompanySchema) => {
				// fix wrong permissions format for junction
				if (payload.admin?.permissions) {
					const permissionsFormat = payload.admin.permissions.map((id) => ({
						custom_permissions_id: id,
					}));
					// @ts-expect-error - API permissions takes this junction format
					payload = { ...payload, admin: { ...payload.admin, permissions: permissionsFormat } };
				}

				const result = await api.request(createItem('companies', payload));

				// attach new admin to this company
				if (result.admin) {
					await api.request(updateUser(result.admin as string, { company: result.id }));
				}

				await companiesCache.mutate();
				toast.success('Entreprise créée !');
				return result;
			},

			update: async (id: number, payload: UpdateCompanySchema) => {
				// fix wrong permissions format for junction
				if (payload.admin?.permissions) {
					const permissionsFormat = payload.admin.permissions.map((id) => ({
						custom_permissions_id: id,
					}));
					// @ts-expect-error - API permissions takes this junction format
					payload = { ...payload, admin: { ...payload.admin, permissions: permissionsFormat } };
				}

				const result = await api.request(updateItem('companies', id, payload));

				// attach new admin to this company
				if (result.admin) {
					await api.request(updateUser(result.admin as string, { company: result.id }));
				}

				await companiesCache.mutate();
				toast.success('Entreprise mise à jour !');
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(
						`Êtes-vous sûr de vouloir supprimer cette entreprise ?\nLes données seront supprimées de manière permanente.`,
					)
				) {
					return;
				}

				const result = await api.request(deleteItem('companies', id));
				await companiesCache.mutate();

				toast.success('Entreprise supprimée !');
				return result;
			},
		}),
		[],
	);

	return {
		data: companiesCache.data ?? [],
		params,
		isLoading: companiesCache.isLoading,
		...companyActions,
	};
};

/**
 * Same as `useCompanies` but for single data.
 */
export const useCompany = (id: number, params?: Params) => {
	const newParams = { ...params, filter: { ...params?.filter, id: { _eq: id } }, limit: 1 };
	const companies = useCompanies(newParams);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdateCompanySchema) => companies.update(id, payload),
			delete: async () => companies.delete(id),
		}),
		[id],
	);

	return {
		data: companies.data[0],
		isLoading: companies.isLoading,
		...actions,
	};
};
