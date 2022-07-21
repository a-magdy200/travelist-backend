import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { sendNotFoundResponse } from "../../helpers/responses/404.response";
import { CycleBooking } from '../../entities/CycleBooking';
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse';
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors';
import { StatusCodes } from '../../helpers/constants/statusCodes';

export const showOneBooking = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	try{
	const booking = await AppDataSource.getRepository(CycleBooking).findOneOrFail({
		where: {
			id
		},
		relations:["cycle","cycle.program","travelers","travelers.user","transaction"]
	})
	if (booking) {
		sendSuccessResponse<CycleBooking>(res, booking);
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
