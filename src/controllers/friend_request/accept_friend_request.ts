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
import {Chat} from "../../entities/Chat.entity";
import {ChatUser} from "../../entities/ChatUser.entity";


const acceptFriendRequest = async (req: Request, res: Response) => {
	const oppsiteTravelerId: number | undefined = +req.params.id
	const currentUserId: number = getUserIdFromToken(req)

	const currentTraveler = await AppDataSource.getRepository(Traveler).findOne({
		where: {
			userId: currentUserId,
		},
	})
	if (currentTraveler && currentTraveler.id !== oppsiteTravelerId) {

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
				alreadySentRequest.status = FriendRequestStatusEnum.APPROVED
				await alreadySentRequest.save()
				const friend: TravelerFriends =
					await AppDataSource.manager.create<TravelerFriends>(TravelerFriends, {
						traveler_sender: { id: oppsiteTravelerId },
						traveler_receiver: { id: currentTraveler.id },
					})
				await AppDataSource.manager.save(friend)
				const insertedChat = await AppDataSource.manager.insert(Chat, {});
				await AppDataSource.manager.insert(ChatUser, {
					chatId: insertedChat.generatedMaps[0].id,
					userId: currentUserId,
				})
				const otherTraveler = await AppDataSource.manager.findOneByOrFail(Traveler, {
					id: oppsiteTravelerId
				})
				await AppDataSource.manager.insert(ChatUser, {
					chatId: insertedChat.generatedMaps[0].id,
					userId: otherTraveler.userId,
				})
				sendSuccessResponse<TravelerFriends>(res, friend)

				//sendSuccessResponse<FriendRequest>(res, alreadySentRequest)

				const traveler: Traveler = await AppDataSource.manager.findOneOrFail<Traveler>(Traveler, {
					where: { id: oppsiteTravelerId },
				})

				const oppsiteUserId = traveler.userId;
				console.log(oppsiteUserId);

				notify({
					type: NotificationEnum.FRIEND_REQUEST_APPROVED,
					userId: oppsiteUserId,
					content: `Your friend request has been accepted`,
					title: 'Friend Request approved',
				})

			} else {
				sendErrorResponse(
					['there is not a request '],
					res,
					StatusCodes.FORBIDDEN
				)
			}
		} catch (error: any) {
			sendErrorResponse(['can not accept request'], res, StatusCodes.NO_CHANGE)
		}
	} else {
		sendErrorResponse(
			['Can not accept friend request'],
			res,
			StatusCodes.FORBIDDEN
		)
	}
}

export { acceptFriendRequest }
