import {Request, Response} from "express";
import {getUserIdFromToken} from "../../../helpers/functions/getUserIdFromToken";
import {Notification} from "../../../entities/Notification.entity";
import {AppDataSource} from "../../../config/database/data-source";
import {sendSuccessResponse} from "../../../helpers/responses/sendSuccessResponse";
import {sendErrorResponse} from "../../../helpers/responses/sendErrorResponse";
import {StatusCodes} from "../../../helpers/constants/statusCodes";
import {Chat} from "../../../entities/Chat.entity";
import {ChatMessage} from "../../../entities/ChatMessage.entity";
import {In} from "typeorm";

const getUserChats = async (req: Request, res: Response) => {
  try {
    const userId: number | undefined = getUserIdFromToken(req);
    if (userId) {
      const userChatsIds: Chat[] = await AppDataSource.manager.find(Chat, {
        where: {
          chatUsers: {
            userId
          }
        },
        select: ['id']
      })
      const userChats: Chat[] = await AppDataSource.manager.find(Chat, {
        where: {
          id: In(userChatsIds.map(c => c.id))
        },
        relations: [
          "chatUsers", "chatUsers.user"
        ],
        order: {
          id: "desc"
        }
      })
      sendSuccessResponse<Chat[]>(res, userChats);
    } else {
      sendErrorResponse(['Not Authorized'], res, StatusCodes.NOT_AUTHORIZED);
    }
  } catch (e: any) {
    sendErrorResponse([e.message], res)
  }
}
const getChatMessages = async (req: Request, res: Response) => {
  try {
    const userId: number | undefined = getUserIdFromToken(req);
    const chatId: number | undefined = +req.params.id;
    if (userId) {
      const chat = await AppDataSource.manager.findOneBy(Chat, {
        chatUsers: {
          userId
        },
        id: chatId
      })
      if (chat) {
        const userChatMessages: ChatMessage[] = await AppDataSource.manager.find(ChatMessage, {
          where: {
            chat: {
              chatUsers: {
                userId
              }
            }
          },
        })
        sendSuccessResponse<ChatMessage[]>(res, userChatMessages);
      } else {
        sendErrorResponse(['Not Authorized'], res, StatusCodes.NOT_AUTHORIZED);
      }
    } else {
      sendErrorResponse(['Not Authorized'], res, StatusCodes.NOT_AUTHORIZED);
    }
  } catch (e: any) {
    sendErrorResponse([e.message], res)
  }
}
export {
  getUserChats,
  getChatMessages
}
