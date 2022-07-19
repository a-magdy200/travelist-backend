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
	const countries: Country[] = await AppDataSource.manager.find<Country>(Country)
	sendSuccessResponse<Country[]>(res, countries);
}

const showCountry = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const country: Country | null = await AppDataSource.manager.findOne<Country>(
		Country,
		{
			where: {id,},
			relations: ["reviews", "programs", "programs.company"]
		}
	)
	if (country) {
		sendSuccessResponse<Country>(res, country);
	} else {
		sendNotFoundResponse(res)
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
		await AppDataSource.manager.delete<Group>(Group, {
			country: {id},
		})
		await AppDataSource.manager.delete<Country>(Country, {
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
		const countryId = countryInsertResult.generatedMaps[0].id;
		const groupInsertResult = await AppDataSource.manager.insert<Group>(Group, {countryId});
		await AppDataSource.manager.update(Country, {id: countryId}, {
			groupId: groupInsertResult.generatedMaps[0].id
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
export {
	createCountry,
	deleteCountry,
	listCountries,
	showCountry,
	updateCountry,
}
