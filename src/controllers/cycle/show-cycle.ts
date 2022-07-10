import { Cycle } from '../../entities/Cycle.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { sendNotFoundResponse } from "../../helpers/responses/404.response";

export const showCycle = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const cycle = await AppDataSource.getRepository(Cycle).findOne({
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
