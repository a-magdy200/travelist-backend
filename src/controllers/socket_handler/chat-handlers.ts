import {ISocketInterface} from "../../helpers/interfaces/ISocket.interface";
import {onlineUsers} from "./index";
import {AppDataSource} from "../../config/database/data-source";
import {ChatMessage} from "../../entities/ChatMessage.entity";
const chatHandlers = (socket: ISocketInterface) => {
  socket.on("private message", ({message, to, chatId}: {message: string, to: number, chatId: number}) => {
    const newMessage = {
      content: message,
      userId: socket.userId,
      id: Math.ceil(Math.random() * 999999999),
      created_at: new Date()
    }
    socket.to(onlineUsers[to]).emit("receive message", newMessage)
    AppDataSource.manager.insert(ChatMessage, {
      content: message,
      userId: socket.userId,
      chatId,
    }).then(r => r);
  })
}
export default chatHandlers;
