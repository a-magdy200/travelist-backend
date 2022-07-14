import { Cycle } from '../../entities/Cycle.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { sendNotFoundResponse } from "../../helpers/responses/404.response";

export const showProgramCycles = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const cycles:Cycle[]  = await AppDataSource.getRepository(Cycle).find({
		where: {
			program:{id:id}
		},
		relations: ["program", "program.company", "bookings", "reviews"],
	})
	if (cycles) {
        sendSuccessResponse<Cycle[]>(res, cycles)
	} else {
		sendNotFoundResponse(res)
	}
}
