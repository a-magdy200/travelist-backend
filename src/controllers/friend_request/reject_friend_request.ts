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
import notify from '../../helpers/common/notify'
import { NotificationEnum } from '../../helpers/enums/notification.enum'

const rejectFriendRequest = async (req: Request, res: Response) => {
	const oppsiteTravelerId: number | undefined = +req.params.id
	const currentUserId: number = getUserIdFromToken(req)

	const currentTraveler = await AppDataSource.getRepository(Traveler).findOne({
		where: {
			userId: currentUserId,
		},
	})
	if (currentTraveler && currentTraveler.id != oppsiteTravelerId) {
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

				const traveler: Traveler =
					await AppDataSource.manager.findOneOrFail<Traveler>(Traveler, {
						where: { id: oppsiteTravelerId },
					})

				const oppsiteUserId = traveler.userId
				console.log(oppsiteUserId)

				notify({
					type: NotificationEnum.FRIEND_REQUEST_DECLINED,
					userId: oppsiteUserId,
					content: `Your friend request has been refused`,
					title: 'Friend request refused',
				})
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

export { rejectFriendRequest }
