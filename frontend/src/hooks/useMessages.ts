import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createMessage, deleteMessage, updateMessage } from 'src/server/actions/message';
import type { MessageInput, MessageParams } from 'src/types';
import { messageParamsSchema } from 'src/validations/message';
import { removeDefaultParams } from 'src/validations/utils';
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
				searchParams.reset(removeDefaultParams(params, messageParamsSchema));
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: MessageInput) => {
				const result = await createMessage(payload);
				toast.success('Message créé !');
				return result;
			},

			update: async (id: string, payload: Partial<MessageInput>) => {
				const result = await updateMessage(id, payload);
				toast.success('Message mis à jour !');
				return result;
			},

			delete: async (id: string) => {
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
