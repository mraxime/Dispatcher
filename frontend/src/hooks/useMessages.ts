import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	messageParamsSchema,
	type CreateMessageSchema,
	type UpdateMessageSchema,
} from 'src/lib/schemas/message.schema';
import type { MessageParams } from 'src/lib/types/directus';
import { createMessage, deleteMessage, updateMessage } from 'src/server/actions/message.action';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful message actions.
 */
export const useMessageActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const messageActions = useMemo(
		() => ({
			setParams: (params: MessageParams) => {
				const newValue = messageParamsSchema.createSearchParams(params);
				searchParams.reset(newValue);
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CreateMessageSchema) => {
				const result = await createMessage(payload);
				toast.success('Message créé !');
				return result;
			},

			update: async (id: number, payload: UpdateMessageSchema) => {
				const result = await updateMessage(id, payload);
				toast.success('Message mis à jour !');
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer ce message ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				await deleteMessage(id);
				toast.success('Message supprimé !');
			},
		}),
		[],
	);

	return messageActions;
};
