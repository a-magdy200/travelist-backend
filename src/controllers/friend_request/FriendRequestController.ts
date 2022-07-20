import { FriendRequest } from '../../entities/FriendRequest.entity'
import { Traveler } from '../../entities/Traveler.entity'
import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { FriendRequestStatusType } from '../../helpers/types/friendRequestStatus.type'
import { FriendRequestStatusEnum } from '../../helpers/enums/friendRequestStatus.enum'
import { TravelerFriends } from '../../entities/TravelerFriend.entity'

const sendFriendRequest = async (req: Request, res: Response) => {
	const oppsiteTravelerId: number | undefined = +req.params.id
	const currentUserId: number = getUserIdFromToken(req)
	console.log(currentUserId)
	/*const currentTraveler = await AppDataSource.getRepository(Traveler).findOne({
		where: {
			currentUserId: userId
		},
	})*/

	const existedFriendRequest: FriendRequest | null =
		await AppDataSource.manager.findOne<FriendRequest>(FriendRequest, {
			where: [
				{
					sender: { id: currentUserId },
					receiver: { id: oppsiteTravelerId },
					status: FriendRequestStatusEnum.PENDING,
				},
				{
					sender: { id: currentUserId },
					receiver: { id: oppsiteTravelerId },
					status: FriendRequestStatusEnum.APPROVED,
				},
				{
					sender: { id: oppsiteTravelerId },
					receiver: { id: currentUserId },
					status: FriendRequestStatusEnum.PENDING,
				},
				{
					sender: { id: oppsiteTravelerId },
					receiver: { id: currentUserId },
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
					sender: { id: 3 },
					receiver: { id: oppsiteTravelerId },
				}
			)

			await friendRequest.save()
			sendSuccessResponse<FriendRequest>(res, friendRequest)
		} catch (error: any) {
			sendErrorResponse(
				['Can not send friend request'],
				res,
				StatusCodes.NO_CHANGE
			)
		}
	}
}
const cancelFriendRequest = async (req: Request, res: Response) => {
	try {
		const oppsiteTravelerId: number | undefined = +req.params.id
		const currentUserId: number = getUserIdFromToken(req)
		const alreadySentRequest: FriendRequest | null =
			await AppDataSource.manager.findOne<FriendRequest>(FriendRequest, {
				where: {
					sender: { id: 3 },
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
			sendErrorResponse(['there is not a request '], res, StatusCodes.FORBIDDEN)
		}
	} catch (error: any) {
		sendErrorResponse(['can not cancel request'], res, StatusCodes.NO_CHANGE)
	}
}

const rejectFriendRequest = async (req: Request, res: Response) => {
	try {
		const oppsiteTravelerId: number | undefined = +req.params.id
		const currentUserId: number = getUserIdFromToken(req)
		const alreadySentRequest: FriendRequest | null =
			await AppDataSource.manager.findOne<FriendRequest>(FriendRequest, {
				where: {
					sender: { id: oppsiteTravelerId },
					receiver: { id: 1 },
					status: FriendRequestStatusEnum.PENDING,
				},
			})

		if (alreadySentRequest) {
			alreadySentRequest.status = FriendRequestStatusEnum.DECLINED
			await alreadySentRequest.save()

			sendSuccessResponse<FriendRequest>(res, alreadySentRequest)
		} else {
			sendErrorResponse(['there is not a request '], res, StatusCodes.FORBIDDEN)
		}
	} catch (error: any) {
		sendErrorResponse(['can not reject request'], res, StatusCodes.NO_CHANGE)
	}
}

const acceptFriendRequest = async (req: Request, res: Response) => {
	try {
		console.log('hello')
		const oppsiteTravelerId: number | undefined = +req.params.id
		const currentUserId: number = getUserIdFromToken(req)
		const alreadySentRequest: FriendRequest | null =
			await AppDataSource.manager.findOne<FriendRequest>(FriendRequest, {
				where: {
					sender: { id: oppsiteTravelerId },
					receiver: { id: 1 },
					status: FriendRequestStatusEnum.PENDING,
				},
			})

		if (alreadySentRequest) {
			alreadySentRequest.status = FriendRequestStatusEnum.APPROVED
			await alreadySentRequest.save()

			const friend: TravelerFriends =
				await AppDataSource.manager.create<TravelerFriends>(TravelerFriends, {
					traveler_sender: { id: oppsiteTravelerId },
					traveler_receiver: { id: 1 },
				})
			if (friend) {
				console.log('friend is added')
			} else {
				console.log('can not add friend')
			}
			sendSuccessResponse<TravelerFriends>(res, friend)

			//sendSuccessResponse<FriendRequest>(res, alreadySentRequest)
		} else {
			sendErrorResponse(['there is not a request '], res, StatusCodes.FORBIDDEN)
		}
	} catch (error: any) {
		sendErrorResponse(['can not accept request'], res, StatusCodes.NO_CHANGE)
	}
}

export {
	sendFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
	cancelFriendRequest,
}
