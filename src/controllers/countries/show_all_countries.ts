import { Request, Response } from 'express'
import { StatusCodes } from './../../helpers/constants/statusCodes';
import { sendSuccessResponse } from './../../helpers/responses/sendSuccessResponse';
import { Country } from './../../entities/Country.entity';
import { AppDataSource } from './../../config/database/data-source';
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse';
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors';


export const show_all_countries = async (req: Request, res: Response, next: any) => {
    const countryRepository = AppDataSource.getRepository(Country);
    try {
        const countries = await countryRepository.find({
            select: {
                id: true,
                name: true,
                average_rate: true,
            }
        })
        if (countries) {
            sendSuccessResponse(
                res,
                countries
            )
        }
        else {
            sendErrorResponse(
                ["Could not find countries"],
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