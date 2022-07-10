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
export {
	listTravelers,
	viewTravelerProfile,
	editTravelerProfile,
}
