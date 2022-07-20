import { RequestHandler } from 'express'
import { Traveler } from '../../entities/Traveler.entity'
import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { travelerValidation } from '../../helpers/validations/traveler.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { getUserIdFromToken } from "../../helpers/functions/getUserIdFromToken";
import { TravelerFriends } from '../../entities/TravelerFriend.entity'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'

const listTravelers = async (req: Request, res: Response) => {
	const travelers: Traveler[] = await AppDataSource.manager.find<Traveler>(
		Traveler,
		{}
	)
	sendSuccessResponse<Traveler[]>(res, travelers)
}

const viewTravelerProfile: RequestHandler = async (req, res) => {
	let criteria;
	if (req.params.id) {
		criteria = {
			id: +req.params.id,
		}
	} else {
		criteria = {
			userId: getUserIdFromToken(req)
		}
	}
	const traveler = await AppDataSource.getRepository(Traveler).findOneOrFail({
		where: criteria,
		relations: {
			user: true,
			reviews: true,
		}
	})
	sendSuccessResponse<Traveler>(res, traveler);
}
const editTravelerProfile = async (req: Request, res: Response) => {
	try {
		const userId = getUserIdFromToken(req)
		const traveler = await AppDataSource.manager.findOneByOrFail<Traveler>(Traveler, {
			userId
		})
		const validation: Traveler = await travelerValidation.validateAsync(
			req.body,
			{ abortEarly: false }
		)
		await AppDataSource.manager.update<Traveler>(
			Traveler,
			{
				id: traveler.id,
			},
			validation
		)
		sendSuccessResponse(res)
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
const listTravelerFriends = async (req: Request, res: Response) => {
	const userId: number = getUserIdFromToken(req)
	const traveler = await AppDataSource.getRepository(Traveler).findOne({
		where: {
			userId: userId
		},
	})
	
if(traveler){	
	console.log(traveler.id)

const friends:TravelerFriends[]  = await AppDataSource.getRepository(TravelerFriends).find({
	
	where:[
		{receiver_id:traveler.id},
		{sender_id:traveler.id}
	],
	relations: ['traveler_sender','traveler_receiver','traveler_sender.user','traveler_receiver.user'],

   })
   sendSuccessResponse<TravelerFriends[]>(res, friends)

}


}
const deleteTravelerFriend = async (req: Request, res: Response) => {
	try {
	const userId: number = getUserIdFromToken(req)
	const traveler = await AppDataSource.getRepository(Traveler).findOne({
		where: {
			userId: userId
		}
	})
	const friendId: number | undefined = +req.params.id
	
	if(traveler && friendId)
	{
		
	await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(TravelerFriends)
    .where({sender_id: traveler.id,receiver_id:friendId} )
	.orWhere({sender_id: friendId,receiver_id:traveler.id})
    .execute()
	sendSuccessResponse(res)
	
	}
}
catch (error: any) {
	sendErrorResponse(error, res, StatusCodes.NOT_FOUND)
}
	
	}




export {
	listTravelers,
	viewTravelerProfile,
	editTravelerProfile,
	listTravelerFriends,
	deleteTravelerFriend
}
