import { useMemo, useState } from 'react';
import { createItem, deleteItem, readItems, updateItem, type Query } from '@directus/sdk';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type { CreateBillSchema, UpdateBillSchema } from 'src/lib/schemas/bills';
import type { Bill, DirectusSchema } from 'src/lib/types/directus';
import { withCompanyIsolation } from './utils';

type Params = Query<DirectusSchema, Bill>;

/**
 * Hook to provide bills data and actions.
 * It allows components using this hook to access the same cache, avoiding unnecessary fetches.
 */
export const useBills = (initialParams?: Params) => {
	const [params, setParams] = useState(initialParams);

	const billsCache = useSWR(['bills', params, Cookies.get('company')], ([, params]) =>
		api.request(readItems('bills', withCompanyIsolation(params))),
	);

	const billActions = useMemo(
		() => ({
			setParams,
			revalidate: () => billsCache.mutate(),

			create: async (payload: CreateBillSchema) => {
				const result = await api.request(createItem('bills', payload));
				await billsCache.mutate();

				toast.success('Facture créée !');
				return result;
			},

			update: async (id: number, payload: UpdateBillSchema) => {
				const result = await api.request(updateItem('bills', id, payload));
				await billsCache.mutate();

				toast.success('Facture mise à jour !');
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(
						`Êtes-vous sûr de vouloir supprimer cette facture ?\nLes données seront supprimées de manière permanente.`,
					)
				) {
					return;
				}

				const result = await api.request(deleteItem('bills', id));
				await billsCache.mutate();

				toast.success('Facture supprimée !');
				return result;
			},
		}),
		[],
	);

	return {
		data: billsCache.data ?? [],
		params,
		isLoading: billsCache.isLoading,
		...billActions,
	};
};

/**
 * Same as `useBills` but for single data.
 */
export const useBill = (id: number, params?: Params) => {
	const newParams = { ...params, filter: { ...params?.filter, id: { _eq: id } }, limit: 1 };
	const bills = useBills(newParams);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdateBillSchema) => bills.update(id, payload),
			delete: async () => bills.delete(id),
		}),
		[id],
	);

	return {
		data: bills.data[0],
		isLoading: bills.isLoading,
		...actions,
	};
};
