import { Request, Response } from 'express'
import { AppDataSource } from '../../../config/database/data-source'
import { Country } from '../../../entities/Country.entity'
import { sendNotFoundResponse } from '../../../helpers/responses/404.response'
import { countryValidation } from '../../../helpers/validations/country.validation'
import { formatValidationErrors } from '../../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../../helpers/constants/statusCodes'
import { sendSuccessResponse } from "../../../helpers/responses/sendSuccessResponse";
import { Group } from "../../../entities/Group.entity";
import { InsertResult } from "typeorm";

const listCountries = async (req: Request, res: Response) => {
	try {
		const countries: Country[] = await AppDataSource.manager.find<Country>(Country)
		sendSuccessResponse<Country[]>(res, countries);
	}
	catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}



const showCountry = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	try {
		const country: Country | null = await AppDataSource.manager.findOneOrFail<Country>(
			Country,
			{
				where: { id, },
				relations: ["reviews", "programs", "programs.company"]
			}
		)
		sendSuccessResponse<Country>(res, country);


	}
	catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}

}

const updateCountry = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		const validation: Country = await countryValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		await AppDataSource.manager.update<Country>(
			Country,
			{
				id,
			},
			validation
		)

		sendSuccessResponse(res);
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
const deleteCountry = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		await AppDataSource.manager.softDelete<Country>(Country, {
			id,
		})
		sendSuccessResponse(res);
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
const createCountry = async (req: Request, res: Response) => {
	try {
		const validation: Country = await countryValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const countryInsertResult: InsertResult = await AppDataSource.manager.insert<Country>(Country, validation)
		const country: Country = countryInsertResult.generatedMaps[0] as Country;
		const groupInsertResult = await AppDataSource.manager.insert<Group>(Group, { countryId: country.id });
		country.groupId = groupInsertResult.identifiers[0].id;
		sendSuccessResponse<Country>(res, country);
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
export {
	createCountry,
	deleteCountry,
	listCountries,
	showCountry,
	updateCountry,
}
