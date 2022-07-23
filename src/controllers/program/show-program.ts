import { Program } from '../../entities/Program.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { sendNotFoundResponse } from "../../helpers/responses/404.response";
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse';
import { StatusCodes } from '../../helpers/constants/statusCodes';
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors';

export const show = async (req: Request, res: Response) => {

	const id: number | undefined = +req.params.id
	try {
		const program = await AppDataSource.getRepository(Program).findOne({
			where: {
				id: parseInt(req.params.id),
			},
			relations: ["company", "company.user", "cycles", "hotels", "transportation", "country", "hotels.country","destinations"],
		})
		if (program) {
			sendSuccessResponse<Program>(res, program)
		} else {
			sendNotFoundResponse(res)
		}
	}
	catch (e: any) {
		sendErrorResponse(
			formatValidationErrors(e),
			res,
			StatusCodes.BAD_REQUEST
		)
	}
}
