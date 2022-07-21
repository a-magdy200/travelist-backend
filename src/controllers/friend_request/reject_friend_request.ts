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


const rejectFriendRequest = async (req: Request, res: Response) => {
	const oppsiteTravelerId: number | undefined = +req.params.id
	const currentUserId: number = getUserIdFromToken(req)
	console.log(currentUserId)
	const currentTraveler = await AppDataSource.getRepository(Traveler).findOne({
		where: {
			userId: currentUserId,
		},
	})
	if (currentTraveler && currentTraveler.id != oppsiteTravelerId) {
		console.log(currentTraveler.id)
		console.log(oppsiteTravelerId)
		try {
			const alreadySentRequest: FriendRequest | null =
				await AppDataSource.manager.findOne<FriendRequest>(FriendRequest, {
					where: {
						sender: { id: oppsiteTravelerId },
						receiver: { id: currentTraveler.id },
						status: FriendRequestStatusEnum.PENDING,
					},
				})

			if (alreadySentRequest) {
				alreadySentRequest.status = FriendRequestStatusEnum.DECLINED
				await alreadySentRequest.save()

				sendSuccessResponse<FriendRequest>(res, alreadySentRequest)
			} else {
				sendErrorResponse(
					['there is not a request '],
					res,
					StatusCodes.FORBIDDEN
				)
			}
		} catch (error: any) {
			sendErrorResponse(['can not reject request'], res, StatusCodes.NO_CHANGE)
		}
	} else {
		sendErrorResponse(
			['Can not reject friend request'],
			res,
			StatusCodes.FORBIDDEN
		)
	}
}



export {
	
	rejectFriendRequest,
	
}
