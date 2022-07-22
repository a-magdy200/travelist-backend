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

const cancelFriendRequest = async (req: Request, res: Response) => {
	const oppsiteTravelerId: number | undefined = +req.params.id
	const currentUserId: number = getUserIdFromToken(req)
    
    
	const currentTraveler = await AppDataSource.getRepository(Traveler).findOne({
		where: {
			userId: currentUserId,
		},
	})
	
	if (currentTraveler&& currentTraveler.id != oppsiteTravelerId) {
		
		try {
			const alreadySentRequest: FriendRequest | null =
				await AppDataSource.manager.findOne<FriendRequest>(FriendRequest, {
					where: {
						sender: { id: currentTraveler.id },
						receiver: { id: oppsiteTravelerId },
						status: FriendRequestStatusEnum.PENDING,
					},
				})

			if (alreadySentRequest) {
				const cancelledRequest = await AppDataSource.getRepository(
					FriendRequest
				).softRemove(alreadySentRequest)
				sendSuccessResponse<FriendRequest>(res, cancelledRequest)
			} else {
				sendErrorResponse(
					['there is not a request '],
					res,
					StatusCodes.FORBIDDEN
				)
			}
		} catch (error: any) {
			sendErrorResponse(['can not cancel request'], res, StatusCodes.NO_CHANGE)
		}
	} else {
		sendErrorResponse(
			['Can not cancel friend request '],
			res,
			StatusCodes.FORBIDDEN
		)
	}
}

export {
	
	cancelFriendRequest,
	
}
