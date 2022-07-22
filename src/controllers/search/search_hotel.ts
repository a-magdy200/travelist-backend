import { Hotel } from './../../entities/Hotel.entity';
import { Request, Response } from 'express'
import { ILike } from 'typeorm'
import { AppDataSource } from '../../config/database/data-source'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { searchParamValidation } from '../../helpers/validations/search-param.validation'



export const searchHotel = async (req: Request, res: Response, next: any) => {
    const userRepository = AppDataSource.getRepository(Hotel)
	try {
		const validatedQuery = await searchParamValidation.validateAsync(
			req.query,
			{
				abortEarly: false,
			}
		)
		const hotels: Hotel[] = await userRepository.find({
			where: {
				name: ILike(`%${validatedQuery.keyword}%`)
			},
			relations: {
                country: true,
			},
		})
		if (hotels.length == 0) {
            return sendErrorResponse(['Could not find hotel'], res, StatusCodes.SUCCESS_NO_CONTENT)
		} else {
			sendSuccessResponse(res, hotels)
		}
	} catch (error: any) {
		return sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}