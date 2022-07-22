import { Cycle } from '../../entities/Cycle.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { sendNotFoundResponse } from "../../helpers/responses/404.response";
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse';
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors';
import { StatusCodes } from '../../helpers/constants/statusCodes';

export const showCycle = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	try {
		const cycle = await AppDataSource.getRepository(Cycle).findOneOrFail({
			where: {
				id
			},
			relations: ["program", "program.company", "bookings", "reviews"],
		})
		if (cycle) {
			sendSuccessResponse<Cycle>(res, cycle);
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
