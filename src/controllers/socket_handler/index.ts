import { ISocketInterface } from "../../helpers/interfaces/ISocket.interface";
import { Socket } from "socket.io";
import chatHandlers from "./chat-handlers";

const socketHandler = (io: any) => {
  const users: {[userId: number]: Socket} = {};
  io.use((socket: ISocketInterface, next: (error?: any) => void) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("invalid user id"));
    }
    socket.userId = userId;
    next();
  });
  io.on("connection", (socket: ISocketInterface) => {
    console.log('a user connected');
    if (socket.userId) {
      users[socket.userId] = socket;
    }
    socket.emit("say hi", "hi");
    console.log("connection", socket.userId);
    socket.onAny((socket: ISocketInterface) => {
      console.log(socket.data);
    })
  });

  chatHandlers(io);
}
export default socketHandler;
