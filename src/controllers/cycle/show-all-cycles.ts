import { Cycle } from '../../entities/Cycle.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";

export const showAllCycles = async (req: Request, res: Response) => {
	const cycles: Cycle[] = await AppDataSource.manager.find<Cycle>(Cycle, {
		relations: ["program", "program.company"],
	})
	sendSuccessResponse<Cycle[]>(res, cycles)
}
