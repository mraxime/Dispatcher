import { Server } from "socket.io";

type SocketData = {
  username: string;
};

type SocketEvents = {
  message: (message: { content: string; roomId: string }) => void;
  "connected-users": (connectedUsers: string[]) => void;
  "user-connected": (userConnected: string) => void;
  "user-disconnected": (disconnectedUser: string) => void;
};

const io = new Server<SocketEvents, SocketEvents, SocketEvents, SocketData>({
  cors: {
    origin: [
      "http://localhost:3000",
      "https://progtech-rev.ca",
      "https://rq.ms",
    ],
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.join(username);
  socket.data.username = username;
  next();
});

io.on("connection", (socket) => {
  console.log(`Connection: #${socket.id}`);

  const connectedUsers = [];
  for (let [_, socket] of io.of("/").sockets) {
    connectedUsers.push(socket.data.username ?? "");
  }
  socket.emit("connected-users", connectedUsers);

  socket.broadcast.emit("user-connected", socket.data.username ?? "");

  socket.on("message", ({ content, roomId }) => {
    socket.to(roomId).emit("message", { content, roomId });
  });

  socket.on("disconnect", () => {
    console.log(`Déconnexion: #${socket.id}`);

    socket.broadcast.emit("user-disconnected", socket.data.username ?? "");
  });
});

io.listen(3050);
