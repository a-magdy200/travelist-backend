import { RequestHandler } from 'express'
import { FriendRequest } from '../../entities/FriendRequest.entity'
import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { friendRequestValidation } from '../../helpers/validations/friend_request.validation'

const sendFriendRequest = async (req: Request, res: Response) => {
	const oppsiteUserId: number | undefined = +req.params.id
	const currentUserId: number = getUserIdFromToken(req)

	const existedFriendRequest: FriendRequest | null =
		await AppDataSource.manager.findOne<FriendRequest>(FriendRequest, {
			where: [
				{ sender: { id: currentUserId }, receiver: { id: oppsiteUserId } },
				{ sender: { id: oppsiteUserId }, receiver: { id: currentUserId } },
			],
		})

	if (existedFriendRequest) {
		//sendSuccessResponse<FriendRequest>(res, existedFriendRequest)
		sendErrorResponse(
			['there is a request already'],
			res,
			StatusCodes.FORBIDDEN
		)
	} else {
		//sendNotFoundResponse(res)
		try {
			const validation: FriendRequest =
				await friendRequestValidation.validateAsync(req.body, {
					abortEarly: false,
				})
			const friendRequest = await AppDataSource.manager.create<FriendRequest>(
				FriendRequest,
				validation
			)
			await friendRequest.save()
			sendSuccessResponse<FriendRequest>(res, friendRequest)
		} catch (error: any) {
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}
}

export {
	sendFriendRequest,
	//acceptFriendRequest,
	//rejectFriendRequest,
	//cancelFriendReuest,
}
