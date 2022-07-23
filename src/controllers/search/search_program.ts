import { Program } from './../../entities/Program.entity';
import { Request, Response } from 'express'
import { ILike } from 'typeorm'
import { AppDataSource } from '../../config/database/data-source'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { searchParamValidation } from '../../helpers/validations/search-param.validation'



export const searchProgram = async (req: Request, res: Response, next: any) => {
    const userRepository = AppDataSource.getRepository(Program)
	try {
		const validatedQuery = await searchParamValidation.validateAsync(
			req.query,
			{
				abortEarly: false,
			}
		)
		const programs: Program[] = await userRepository.find({
			where: {
				name: ILike(`%${validatedQuery.keyword}%`)
			},
			relations: {
                country: true,
                company: true,
			},
		})
		if (programs.length == 0) {
            return sendErrorResponse(['Could not find program'], res, StatusCodes.SUCCESS_NO_CONTENT)
		} else {
			sendSuccessResponse(res, programs)
		}
	} catch (error: any) {
		return sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}