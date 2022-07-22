import { Request, Response } from 'express'
import { StatusCodes } from './../../helpers/constants/statusCodes'
import { sendSuccessResponse } from './../../helpers/responses/sendSuccessResponse'
import { Country } from './../../entities/Country.entity'
import { AppDataSource } from './../../config/database/data-source'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'

export const get_country = async (req: Request, res: Response, next: any) => {
	const countryRepository = AppDataSource.getRepository(Country)
    const id: number | undefined = +req.params.id
	try {
		const country = await countryRepository.findOne({
			where: {
                id: id
            },
            relations: {
                programs: true,
                reviews: true,
                hotels: true,
                group: true
            }
		})
        if(country){
            sendSuccessResponse(
                res,
                country
            )
        } else {
            sendErrorResponse(
                ["Could not find country"],
                res,
                StatusCodes.NOT_FOUND
            )
        }
	} catch (error: any) {
        sendErrorResponse(
			formatValidationErrors(error),
            res,
			StatusCodes.NOT_ACCEPTABLE
        )
    }
}
