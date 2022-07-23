import { ISocketInterface } from "../../helpers/interfaces/ISocket.interface";
import chatHandlers from "./chat-handlers";

export const onlineUsers: {[userId: number]: string} = {};
const socketHandler = (io: any) => {
  io.use((socket: ISocketInterface, next: (error?: any) => void) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("invalid user id"));
    }
    socket.userId = userId;
    next();
  });
  io.on("connection", (socket: ISocketInterface) => {
    if (socket.userId) {
      onlineUsers[socket.userId] = socket.id;
    }
    // socket.onAny((s: ISocketInterface, d: any) => {
    //   console.log(s, d);
    // })
    chatHandlers(socket);
  });
}
export default socketHandler;
