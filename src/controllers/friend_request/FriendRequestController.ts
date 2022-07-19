import { RequestHandler } from 'express'
import { FriendRequest } from '../../entities/FriendRequest.entity'
import { Traveler } from '../../entities/Traveler.entity'
import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { friendRequestValidation } from '../../helpers/validations/friend_request.validation'
import { FriendRequestStatusType } from '../helpers/types/friendRequestStatus.type'
import { FriendRequestStatusEnum } from '../helpers/enums/friendRequestStatus.enum'

const sendFriendRequest = async (req: Request, res: Response) => {
	const oppsiteTravelerId:number | undefined = +req.params.id
	const currentUserId: number = getUserIdFromToken(req)
	console.log(currentUserId)
	console.log("hello")
/*
    	if (currentUserId) {
			const currentTravelerId: Traveler| null =
				await AppDataSource.manager.findOne<Traveler>(Traveler, {
					where: {
						user: { id: currentUserId},
					},
				})
				//console.log( currentTravelerId)
			
		}*/
	const existedFriendRequest: FriendRequest | null =
		await AppDataSource.manager.findOne<FriendRequest>(FriendRequest, {
			where: [
				{ sender: { id: currentUserId }, receiver: { id: oppsiteTravelerId }, },
				{ sender: { id: oppsiteTravelerId }, receiver: { id: currentUserId }},
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
					receiver: { id: oppsiteTravelerId }
				}
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
const cancelFriendRequest=async (req: Request, res: Response) => {
	
	const oppsiteTravelerId:number | undefined = +req.params.id
	const currentUserId: number = getUserIdFromToken(req)
	const alreadySentRequest: FriendRequest | null = await AppDataSource.manager.findOne<FriendRequest>(
		FriendRequest,
		{
			where:{ sender: { id: 3 }, receiver: { id: oppsiteTravelerId }}
				
		}
	) 
//	console.log("hi from already sent request")
	if(alreadySentRequest){
		const cancelledRequest=await AppDataSource.getRepository(FriendRequest).softRemove(alreadySentRequest)
		sendSuccessResponse<FriendRequest>(res, cancelledRequest)

	}else{
		sendErrorResponse(
			['there is not a request '],
			res,
			StatusCodes.FORBIDDEN
		)
	}

}

const rejectFriendRequest=async (req: Request, res: Response) => {
	const oppsiteTravelerId:number | undefined = +req.params.id
	const currentUserId: number = getUserIdFromToken(req)
	const alreadySentRequest: FriendRequest | null = await AppDataSource.manager.findOne<FriendRequest>(
		FriendRequest,
		{
			where:{ sender: { id: oppsiteTravelerId  }, receiver: { id: 2 }}
				
		}
	) 
//	console.log("hi from already sent request")
	if(alreadySentRequest){
		   alreadySentRequest.status=FriendRequestStatusEnum.DECLINED
		    await alreadySentRequest.save()
			sendSuccessResponse<FriendRequest>(res, alreadySentRequest)
	}else{
		sendErrorResponse(
			['there is not a request '],
			res,
			StatusCodes.FORBIDDEN
		)
	}
	
}


export {
	sendFriendRequest,
	//acceptFriendRequest,
	rejectFriendRequest,
	cancelFriendRequest,
}
