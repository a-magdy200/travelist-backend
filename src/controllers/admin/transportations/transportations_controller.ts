import { Request, Response } from 'express'
import { AppDataSource } from '../../../config/database/data-source'
import { Transportation } from '../../../entities/Transportation.entity'
import { sendNotFoundResponse } from '../../../helpers/responses/404.response'
import { transportationValidation } from '../../../helpers/validations/transportation.validation'
import { formatValidationErrors } from '../../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../../helpers/constants/statusCodes'
import { sendSuccessResponse } from "../../../helpers/responses/sendSuccessResponse";

const listTransportations = async (req: Request, res: Response) => {
	try {
		const transportations: Transportation[] = await AppDataSource.manager.find<Transportation>(Transportation)
		sendSuccessResponse<Transportation[]>(res, transportations);
	}
	catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}

const showTransportation = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	try {
		const transportation: Transportation | null = await AppDataSource.manager.findOneOrFail<Transportation>(
			Transportation,
			{
				where: { id, },
			}
		)
		sendSuccessResponse<Transportation>(res, transportation);

	}
	catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}

const updateTransportation = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		const validation: Transportation = await transportationValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		await AppDataSource.manager.update<Transportation>(
			Transportation,
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
const deleteTransportation = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		await AppDataSource.manager.softDelete<Transportation>(Transportation, {
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
const createTransportation = async (req: Request, res: Response) => {
	try {
		const validation: Transportation = await transportationValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const transportation = await AppDataSource.manager.create<Transportation>(Transportation, validation)
		await transportation.save()
		sendSuccessResponse<Transportation>(res, transportation);
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
export {
	createTransportation,
	deleteTransportation,
	listTransportations,
	showTransportation,
	updateTransportation,
}
