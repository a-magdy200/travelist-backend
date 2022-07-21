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

const listReceivedRequests = async (req: Request, res: Response) => {
	const currentUserId: number = getUserIdFromToken(req)
  
	const currentTraveler = await AppDataSource.getRepository(Traveler).findOne({
		where: {
			userId: currentUserId,
		},
	})
	if (currentTraveler) {
		
		const receivedFriendRequests: FriendRequest[]| null =
			await AppDataSource.manager.find<FriendRequest>(FriendRequest, {
				where: 
					{
						
						receiver: { id: currentTraveler.id },
						status: FriendRequestStatusEnum.PENDING,
					}
				,
			})
            if(receivedFriendRequests){
                sendSuccessResponse<FriendRequest[]>(res, receivedFriendRequests)
              
            }
            else{
                sendNotFoundResponse(res)
	}
            }

	
}

const listSentRequests = async (req: Request, res: Response) => {
	const currentUserId: number = getUserIdFromToken(req)
  
	const currentTraveler = await AppDataSource.getRepository(Traveler).findOne({
		where: {
			userId: currentUserId,
		},
	})
	if (currentTraveler) {
		
		const sentFriendRequests: FriendRequest[]| null =
			await AppDataSource.manager.find<FriendRequest>(FriendRequest, {
				where: 
					{
						
						sender: { id: currentTraveler.id },
						status: FriendRequestStatusEnum.PENDING,
					}
				,
			})
            if(sentFriendRequests){
                sendSuccessResponse<FriendRequest[]>(res, sentFriendRequests)
              
            }
            else{
                sendNotFoundResponse(res)
	}
            }

	
}




export {
	listReceivedRequests,
    listSentRequests,
}
