import { Traveler } from './../../entities/Traveler.entity';
import { Request, Response } from 'express'
import { ILike } from 'typeorm'
import { AppDataSource } from '../../config/database/data-source'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { searchParamValidation } from '../../helpers/validations/search-param.validation'


export const searchTraveler = async (req: Request, res: Response, next: any) => {
    const userRepository = AppDataSource.getRepository(Traveler)
	try {
		const validatedQuery = await searchParamValidation.validateAsync(
			req.query,
			{
				abortEarly: false,
			}
		)
		const travelers: Traveler[] = await userRepository.find({
			where: {
				user: {name: ILike(`%${validatedQuery.keyword}%`)
                }
			},
            relations: {
                user: true
            }
		})
		if (travelers.length == 0) {
            return sendErrorResponse(['Could not find traveler'], res, StatusCodes.SUCCESS_NO_CONTENT)
		} else {
			sendSuccessResponse(res, travelers)
		}
	} catch (error: any) {
		return sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}