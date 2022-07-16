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
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'

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
			user: true
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
	const traveler = await AppDataSource.getRepository(Traveler).findOneOrFail({
		where: {
			userId: userId
		}
	})
	/*const friends:Traveler[] = await AppDataSource
	.getRepository(Traveler)
	.createQueryBuilder("traveler")
	.leftJoin("traveler.friends", "friends")
	.where('friends.travelersId_1 = :id', { id: traveler.id })
	.orWhere('friends .travelersId_2 = :id', { id: traveler.id })
	// .where({travelersId_1:userId})
	// .orWhere({travelersId_2:userId})
	.getRawMany()*/
	
	// 	const friends:Traveler[]=await AppDataSource.getRepository(Traveler)
	// 	.createQueryBuilder('traveler')
	//     .innerJoin(
	//        'traveler.friends', 
	//        'friends', 
	// 	).where(
	//        'friends.id = :travelersId_1', 
	//        { travelersId_2:userId }
	// 	)
	//   .getMany();
	/*const friends: Traveler[] = await AppDataSource
		.getRepository(Traveler)
		.createQueryBuilder("traveler")
		.leftJoin("traveler.friends", "friends")
		.where("friends")
		.loadMany();*/
		
	//  const friends: Traveler[] = await AppDataSource
	//  	.createQueryBuilder()
	//  	.relation(
	//  		Traveler,
	//  		'friends',
	//  	)
	//      .of({id: traveler.id})
	//  	.loadMany();
	// 	const friends: Traveler[] = await AppDataSource.getRepository(Traveler)
	// 	.find({
	// 		relations: ["friends"],
	// 		where: "traveler_1 = :id OR traveler_2 = :id"
	// 	})
		//const friends: Traveler[] = await AppDataSource
		//.createQueryBuilder()
		//.leftJoin
	/*const friends:Traveler[] = await AppDataSource
    .getRepository(Traveler)
    .createQueryBuilder("traveler")
    .leftJoin("traveler.friends", "friend")
    .getMany()
	sendSuccessResponse<Traveler[]>(res, friends)
*/
}
const deleteTravelerFriend = async (req: Request, res: Response) => {
	const userId: number = getUserIdFromToken(req)
	const traveler = await AppDataSource.getRepository(Traveler).findOneOrFail({
		where: {
			userId: userId
		}
	})
}
export {
	listTravelers,
	viewTravelerProfile,
	editTravelerProfile,
	listTravelerFriends,
}
