import {ISocketInterface} from "../../helpers/interfaces/ISocket.interface";
import {onlineUsers} from "./index";
const chatHandlers = (socket: ISocketInterface) => {
  socket.on("private message", ({message, to}: {message: string, to: number}) => {
    socket.to(onlineUsers[to]).emit("receive message", message)
  })
}
export default chatHandlers;
