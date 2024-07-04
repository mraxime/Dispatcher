import { Server } from 'socket.io';

type SocketData = {
	username: string;
};

type SocketEvents = {
	message: (message: { content: string; roomId: string }) => void;
	'receive-connected-users': (connectedUsers: string[]) => void;
	'user-connected': (userConnected: string) => void;
	'user-disconnected': (disconnectedUser: string) => void;
	'update-calendar': () => void;
};

const io = new Server<SocketEvents, SocketEvents, SocketEvents, SocketData>({
	cors: {
		origin: ['http://localhost:3000'],
		methods: ['GET', 'POST'],
	},
});

// TODO: improve security guard
io.use((socket, next) => {
	const username = socket.handshake.auth.username;
	if (!username) {
		return next(new Error('invalid username'));
	}
	socket.join(username);
	socket.data.username = username;
	next();
});

const CONNECTED_USERNAMES: Set<string> = new Set();

io.on('connection', (socket) => {
	console.log(`${socket.data.username}(${socket.id}): Connexion`);

	// Add to connected list
	CONNECTED_USERNAMES.add(socket.data.username);
	socket.emit('receive-connected-users', [...CONNECTED_USERNAMES]);

	// Notice other sockets
	socket.broadcast.emit('user-connected', socket.data.username);

	// Calendar real-time update
	// TODO: specify which companyId calendar to update
	// TODO: rename emit to "calendar-updated"
	socket.on('update-calendar', () => {
		socket.broadcast.emit('update-calendar');
	});

	// Messages
	socket.on('message', ({ content, roomId }) => {
		socket.to(roomId).emit('message', { content, roomId });
	});

	// Cleanup
	socket.on('disconnect', () => {
		console.log(`${socket.data.username}(${socket.id}): Déconnexion`);

		socket.broadcast.emit('user-disconnected', socket.data.username);
		CONNECTED_USERNAMES.delete(socket.data.username);
	});
});

io.listen(3010);
console.log('Socket listening on port 3010...');
