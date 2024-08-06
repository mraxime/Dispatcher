import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type FC,
	type ReactNode,
} from 'react';
import toast from 'react-hot-toast';
import { io, type Socket } from 'socket.io-client';

import { useOptionalSession } from 'src/hooks/useSession';

/**
 * Possible events for the socket.io instance
 */
type SocketEvents = {
	message: (message: { content: string; roomId: string }) => void;
	'connected-users': (connectedUsers: string[]) => void;
	'user-connected': (connectedUser: string) => void;
	'user-disconnected': (disconnectedUser: string) => void;
};

type ContextValue = {
	socket: Socket<SocketEvents>;
	connectedUsers: string[];
};

const Context = createContext<ContextValue>(undefined!);

export const useSocket = () => {
	const contextValue = useContext(Context);
	if (contextValue === undefined) {
		throw new Error(`useSocketContext must be within a SocketProvider`);
	}

	return contextValue;
};

type SocketProviderProps = {
	children: ReactNode;
};

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
	const session = useOptionalSession();
	const [socket, setSocket] = useState<ContextValue['socket']>();
	const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

	useEffect(() => {
		if (session.data) {
			const socketIo: ContextValue['socket'] = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
				auth: { username: session.data.email },
			});

			socketIo.on('connected-users', (connectedUsers) => {
				setConnectedUsers(connectedUsers);
			});

			socketIo.on('user-connected', (connectedUser) => {
				setConnectedUsers((previous) => [...previous, connectedUser]);
				toast.success(`${connectedUser} vient de se connecter`);
			});

			socketIo.on('user-disconnected', (disconnectedUser) => {
				setConnectedUsers((previous) => previous.filter((user) => user !== disconnectedUser));
			});

			setSocket(socketIo);

			return () => {
				socketIo.removeAllListeners();
				socketIo.disconnect();
			};
		}
	}, [session.data]);

	const value = useMemo(() => ({ socket: socket!, connectedUsers }), [connectedUsers, socket]);

	if (!value.socket) return <>{children}</>;

	return <Context.Provider value={value}>{children}</Context.Provider>;
};
