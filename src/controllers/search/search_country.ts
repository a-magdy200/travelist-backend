import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { Country } from '../../entities/Country.entity'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { ILike } from 'typeorm'
import { searchParamValidation } from '../../helpers/validations/search-param.validation'

export const searchCountry = async (req: Request, res: Response, next: any) => {
	const countryRepository = AppDataSource.getRepository(Country)
	try {
		const validatedQuery = await searchParamValidation.validateAsync(
			req.query,
			{
				abortEarly: false,
			}
		)
		const countries: Country[] = await countryRepository.find({
			where: {
				name: ILike(`%${validatedQuery.keyword}%`),
			},
			relations: {
				programs: true,
				reviews: true,
				hotels: true,
				group: true,
			},
		})

		if (countries.length == 0) {
            return sendErrorResponse(['Could not find country'], res, StatusCodes.SUCCESS_NO_CONTENT)
		} else {
			return sendSuccessResponse(res, countries)
		}
	} catch (error: any) {
		return sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
