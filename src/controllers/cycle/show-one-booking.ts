import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { sendNotFoundResponse } from "../../helpers/responses/404.response";
import { CycleBooking } from '../../entities/CycleBooking';

export const showOneBooking = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const booking = await AppDataSource.getRepository(CycleBooking).findOne({
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
