import {NextFunction, Request, Response} from "express";
import {sendErrorResponse} from "../../../helpers/responses/sendErrorResponse";
import {AppDataSource} from "../../../config/database/data-source";
import {getUserIdFromToken} from "../../../helpers/functions/getUserIdFromToken";
import {StatusCodes} from "../../../helpers/constants/statusCodes";
import {Notification} from "../../../entities/Notification.entity";
import {sendSuccessResponse} from "../../../helpers/responses/sendSuccessResponse";
import {NotificationStatusEnum} from "../../../helpers/enums/notificationStatus.enum";

const getAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: number | undefined = getUserIdFromToken(req);
    if (userId) {
      const userNotifications: Notification[] = await AppDataSource.manager.findBy(Notification, {
        userId
      })
      sendSuccessResponse<Notification[]>(res, userNotifications);
    } else {
      sendErrorResponse(['Not Authorized'], res, StatusCodes.NOT_AUTHORIZED);
    }
  } catch (e: any) {
    sendErrorResponse([e.message], res)
  }
}
const readAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: number | undefined = getUserIdFromToken(req);
    if (userId) {
      await AppDataSource.manager.update(Notification, {
        userId
      }, {
        status: NotificationStatusEnum.READ
      })
      sendSuccessResponse(res);
    } else {
      sendErrorResponse(['Not Authorized'], res, StatusCodes.NOT_AUTHORIZED);
    }
  } catch (e: any) {
    sendErrorResponse([e.message], res)
  }
}
export {
  readAllNotifications,
  getAllNotifications
}
