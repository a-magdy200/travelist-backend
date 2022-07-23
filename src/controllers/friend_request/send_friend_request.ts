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
import { NotificationEnum } from '../../helpers/enums/notification.enum'
import notify from '../../helpers/common/notify'

const sendFriendRequest = async (req: Request, res: Response) => {
	const oppsiteTravelerId: number | undefined = parseInt(req.params.id)
	const currentUserId: number = getUserIdFromToken(req)
  
	const currentTraveler = await AppDataSource.getRepository(Traveler).findOne({
		where: {
			userId: currentUserId,
		},
	})
	if (currentTraveler && currentTraveler.id != oppsiteTravelerId) {
		
		const existedFriendRequest: FriendRequest | null =
			await AppDataSource.manager.findOne<FriendRequest>(FriendRequest, {
				where: [
					{
						sender: { id: currentTraveler.id },
						receiver: { id: oppsiteTravelerId },
						status: FriendRequestStatusEnum.PENDING,
					},
					{
						sender: { id: currentTraveler.id },
						receiver: { id: oppsiteTravelerId },
						status: FriendRequestStatusEnum.APPROVED,
					},
					{
						sender: { id: oppsiteTravelerId },
						receiver: { id: currentTraveler.id },
						status: FriendRequestStatusEnum.PENDING,
					},
					{
						sender: { id: oppsiteTravelerId },
						receiver: { id: currentTraveler.id },
						status: FriendRequestStatusEnum.APPROVED,
					},
				],
			})

		if (existedFriendRequest) {
			sendErrorResponse(
				['there is a request already'],
				res,
				StatusCodes.FORBIDDEN
			)
		} else {
			try {
				const friendRequest = await AppDataSource.manager.create<FriendRequest>(
					FriendRequest,
					{
						sender: { id: currentTraveler.id },
						receiver: { id: oppsiteTravelerId },
					}
				)

				await friendRequest.save()
				sendSuccessResponse<FriendRequest>(res, friendRequest)

				const traveler: Traveler = await AppDataSource.manager.findOneOrFail<Traveler>(Traveler, {
					where: { id: oppsiteTravelerId },
				})

				const oppsiteUserId = traveler.userId;
				console.log(oppsiteUserId);

				notify({
					type: NotificationEnum.FRIEND_REQUEST_RECEIVED,
					userId: oppsiteUserId,
					content: `New friend request has been sent`,
					title: 'Friend Request received',
				})

			} catch (error: any) {
				sendErrorResponse(
					['Can not send friend request'],
					res,
					StatusCodes.NO_CHANGE
				)
			}
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
	sendFriendRequest,
}
