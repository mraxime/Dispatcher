'use client';

import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type FC,
	type ReactNode,
} from 'react';
import { io, type Socket } from 'socket.io-client';
import PageLoading from 'src/components/base/PageLoading';
import type { User } from 'src/types';

/**
 * Possible events for the socket.io instance
 */
type SocketEvents = {
	message: (message: { content: string; roomId: string }) => void;
	'receive-connected-users': (connectedUsers: string[]) => void;
	'user-connected': (connectedUser: string) => void;
	'user-disconnected': (disconnectedUser: string) => void;
	'update-calendar': () => void;
};

type ContextValue = {
	socket: Socket<SocketEvents>;
	connectedUsers: string[];
};

const Context = createContext<ContextValue>(undefined!);

type SocketProviderProps = {
	user: User;
	children: ReactNode;
};

export const SocketProvider: FC<SocketProviderProps> = ({ children, user }) => {
	const [socket, setSocket] = useState<ContextValue['socket']>();
	const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

	useEffect(() => {
		if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
			throw new Error('Please provide env: NEXT_PUBLIC_SOCKET_URL');
		}

		const socketIo: ContextValue['socket'] = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
			auth: { username: user.username, companyId: user.companyId },
		});

		/** TODO: filter out sockets that is not part of user 'accessibleCompanies' */

		socketIo.on('receive-connected-users', (connectedUsers) => {
			setConnectedUsers(connectedUsers);
		});

		socketIo.on('user-connected', (username) => {
			setConnectedUsers((previous) => [...previous, username]);
			// toast.success(`${username} vient de se connecter`);
		});

		socketIo.on('user-disconnected', (username) => {
			setConnectedUsers((previous) => previous.filter((value) => value !== username));
		});

		setSocket(socketIo);

		return () => {
			socketIo.removeAllListeners();
			socketIo.disconnect();
		};
	}, [user.id]);

	const value = useMemo(() => ({ socket: socket!, connectedUsers }), [connectedUsers, socket]);

	if (!value.socket) return <PageLoading />;
	return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useSocket = () => {
	const contextValue = useContext(Context);
	if (contextValue === undefined) {
		throw new Error(`useSocketContext must be within a SocketProvider`);
	}

	return contextValue;
};
