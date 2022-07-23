import { FriendRequest } from '../../entities/FriendRequest.entity'
import { Traveler } from '../../entities/Traveler.entity'
import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { FriendRequestStatusType } from '../../helpers/types/friendRequestStatus.type'
import { FriendRequestStatusEnum } from '../../helpers/enums/friendRequestStatus.enum'
import { TravelerFriends } from '../../entities/TravelerFriend.entity'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'

const checkTravelerHasFriendRequest = async (req: Request, res: Response) => {
  const oppositeTravelerId: number | undefined = +req.params.travelerId
  const currentUserId: number = getUserIdFromToken(req)

  const currentTraveler = await AppDataSource.getRepository(Traveler).findOne({
    where: {
      userId: currentUserId,
    },
  })
  if (currentTraveler && currentTraveler.id !== oppositeTravelerId) {

    const existedFriendRequest: FriendRequest | null =
      await AppDataSource.manager.findOne<FriendRequest>(FriendRequest, {
        where: [
          {
            sender: { id: currentTraveler.id },
            receiver: { id: oppositeTravelerId },
            status: FriendRequestStatusEnum.PENDING,
          },
          {
            sender: { id: currentTraveler.id },
            receiver: { id: oppositeTravelerId },
            status: FriendRequestStatusEnum.APPROVED,
          },
          {
            sender: { id: oppositeTravelerId },
            receiver: { id: currentTraveler.id },
            status: FriendRequestStatusEnum.PENDING,
          },
          {
            sender: { id: oppositeTravelerId },
            receiver: { id: currentTraveler.id },
            status: FriendRequestStatusEnum.APPROVED,
          },
        ],
      })
    if (existedFriendRequest) {
      sendSuccessResponse(res, existedFriendRequest);
    } else {
      sendSuccessResponse(res, false)
    }
  } else {
    sendErrorResponse(
      ['Can not send friend request for same user'],
      res,
      StatusCodes.FORBIDDEN
    )
  }
}


export {
  checkTravelerHasFriendRequest
}
