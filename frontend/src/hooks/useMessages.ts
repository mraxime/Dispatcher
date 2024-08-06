import { useMemo, useState } from 'react';
import { createItem, deleteItem, readItems, updateItem, type Query } from '@directus/sdk';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type { CreateMessageSchema, UpdateMessageSchema } from 'src/lib/schemas/messages';
import type { DirectusSchema, Message } from 'src/lib/types/directus';

type Params = Query<DirectusSchema, Message>;

/**
 * Hook to provide messages data and actions.
 * It allows components using this hook to access the same cache, avoiding unnecessary fetches.
 */
export const useMessages = (initialParams?: Params) => {
	const [params, setParams] = useState(initialParams);

	const messagesCache = useSWR(['messages', params], ([, params]) =>
		api.request(readItems('messages', params)),
	);

	const messageActions = useMemo(
		() => ({
			setParams,
			revalidate: () => messagesCache.mutate(),

			create: async (payload: CreateMessageSchema) => {
				const result = await api.request(createItem('messages', payload));
				await messagesCache.mutate();

				toast.success('Message créé !');
				return result;
			},

			update: async (id: number, payload: UpdateMessageSchema) => {
				const result = await api.request(updateItem('messages', id, payload));
				await messagesCache.mutate();

				toast.success('Message mis à jour !');
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(
						`Êtes-vous sûr de vouloir supprimer ce message ?\nLes données seront supprimées de manière permanente.`,
					)
				) {
					return;
				}

				const result = await api.request(deleteItem('messages', id));
				await messagesCache.mutate();

				toast.success('Message supprimé !');
				return result;
			},
		}),
		[],
	);

	return {
		data: messagesCache.data ?? [],
		params,
		isLoading: messagesCache.isLoading,
		...messageActions,
	};
};

/**
 * Same as `useMessages` but for single data.
 */
export const useMessage = (id: number, params?: Params) => {
	const newParams = { ...params, filter: { ...params?.filter, id: { _eq: id } }, limit: 1 };
	const messages = useMessages(newParams);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdateMessageSchema) => messages.update(id, payload),
			delete: async () => messages.delete(id),
		}),
		[id],
	);

	return {
		data: messages.data[0],
		isLoading: messages.isLoading,
		...actions,
	};
};
