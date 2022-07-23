import {Notification} from "../../entities/Notification.entity";
import {AppDataSource} from "../../config/database/data-source";
import {onlineUsers} from "../../controllers/socket_handler";
import {io} from "../../../app";
import {NotificationEnum} from "../enums/notification.enum";
interface INotificationInterface {
  type: NotificationEnum;
  userId: number;
  content: string
  title: string
}
const notify = async (notification: INotificationInterface) => {
  const insertResult = await AppDataSource.manager.insert<Notification>(Notification, notification);
  const insertedNotification = {
    ...notification,
    ...insertResult.generatedMaps[0]
  }
  io.sockets.to(onlineUsers[notification.userId]).emit("notification", insertedNotification);
}
export default notify;
