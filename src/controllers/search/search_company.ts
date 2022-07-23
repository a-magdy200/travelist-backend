import { Company } from './../../entities/Company.entity';
import { Request, Response } from 'express'
import { ILike } from 'typeorm'
import { AppDataSource } from '../../config/database/data-source'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { searchParamValidation } from '../../helpers/validations/search-param.validation'



export const searchCompany = async (req: Request, res: Response, next: any) => {
    const userRepository = AppDataSource.getRepository(Company)
	try {
		const validatedQuery = await searchParamValidation.validateAsync(
			req.query,
			{
				abortEarly: false,
			}
		)
		const companies: Company[] = await userRepository.find({
			where: {
				user: {name: ILike(`%${validatedQuery.keyword}%`)
                }
			},
            relations: {
                user: true
            }
		})
		if (companies.length == 0) {
            return sendErrorResponse(['Could not find company'], res, StatusCodes.SUCCESS_NO_CONTENT)
		} else {
			sendSuccessResponse(res, companies)
		}
	} catch (error: any) {
		return sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
    // const userRepository = AppDataSource.getRepository(User)
	// try {
	// 	const validatedQuery = await searchParamValidation.validateAsync(
	// 		req.query,
	// 		{
	// 			abortEarly: false,
	// 		}
	// 	)
	// 	const companies: User[] = await userRepository.find({
	// 		where: {
    //             type: UserTypeEnum.COMPANY,
	// 			name: ILike(`%${validatedQuery.keyword}%`)
	// 		},
	// 		relations: {
	// 			company: true,
	// 		},
	// 	})
	// 	if (companies.length == 0) {
    //         return sendErrorResponse(['Could not find company'], res, StatusCodes.NOT_FOUND)
	// 	} else {
	// 		sendSuccessResponse(res, companies)
	// 	}
	// } catch (error: any) {
	// 	return sendErrorResponse(
	// 		formatValidationErrors(error),
	// 		res,
	// 		StatusCodes.NOT_ACCEPTABLE
	// 	)
	// }
}