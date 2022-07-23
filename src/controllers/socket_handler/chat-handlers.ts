import {ISocketInterface} from "../../helpers/interfaces/ISocket.interface";
import {onlineUsers} from "./index";
import notify from "../../helpers/common/notify";
import {NotificationEnum} from "../../helpers/enums/notification.enum";

const chatHandlers = (socket: ISocketInterface) => {
  socket.on("private message", ({message, to}: {message: string, to: number}) => {
    notify({
      type: NotificationEnum.FRIEND_REQUEST_APPROVED,
      userId: to,
      content: "halllo",
      title: 'something'
    })
    notify({
      type: NotificationEnum.ADMIN_DELETE_POST,
      userId: to,
      content: "Your post has been deleted",
      title: "Post Deleted",
    })
    socket.to(onlineUsers[to]).emit("receive message", message)
  })
}
export default chatHandlers;
