import { Cycle } from '../../entities/Cycle.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse';
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors';
import { StatusCodes } from '../../helpers/constants/statusCodes';

export const showAllCycles = async (req: Request, res: Response) => {
	try {
		const cycles: Cycle[] = await AppDataSource.manager.find<Cycle>(Cycle, {
			relations: ["program", "program.company"],
		})
		sendSuccessResponse<Cycle[]>(res, cycles)
	}
	catch (e: any) {
		sendErrorResponse(
			formatValidationErrors(e),
			res,
			StatusCodes.BAD_REQUEST
		)
	}
}
