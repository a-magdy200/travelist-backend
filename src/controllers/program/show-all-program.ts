import { Program } from '../../entities/Program.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse';
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors';
import { StatusCodes } from '../../helpers/constants/statusCodes';

export const showAll = async (req: Request, res: Response) => {
	try {
		const programs: Program[] = await AppDataSource.manager.find<Program>(
			Program,
			{
				relations: ["company", "company.user", "cycles", "hotels", "transportation", "country","destinations"],
			}
		)
		sendSuccessResponse<Program[]>(res, programs);
	}
	catch (e: any) {
		sendErrorResponse(
			formatValidationErrors(e),
			res,
			StatusCodes.BAD_REQUEST
		)
	}
}
