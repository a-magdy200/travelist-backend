import { User } from './../../entities/User.entity';
import { Request, Response } from 'express'
import { ILike } from 'typeorm'
import { AppDataSource } from '../../config/database/data-source'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { searchParamValidation } from '../../helpers/validations/search-param.validation'
import { UserTypeEnum } from '../../helpers/enums/userType.enum';


export const searchTraveler = async (req: Request, res: Response, next: any) => {
    const userRepository = AppDataSource.getRepository(User)
	try {
		const validatedQuery = await searchParamValidation.validateAsync(
			req.query,
			{
				abortEarly: false,
			}
		)
		const travelers: User[] = await userRepository.find({
			where: {
                type: UserTypeEnum.TRAVELER,
				name: ILike(`%${validatedQuery.keyword}%`)
			},
			relations: {
				traveler: true,
			},
		})
		if (travelers.length == 0) {
            return sendErrorResponse(['Could not find traveler'], res, StatusCodes.NOT_FOUND)
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