import { Program } from '../../entities/Program.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";

export const showAll = async (req: Request, res: Response) => {
	const programs: Program[] = await AppDataSource.manager.find<Program>(
		Program,
		{
			relations: ["company", "cycles", "hotels", "transportation", "country"],
		}
	)
	sendSuccessResponse<Program[]>(res, programs);
}
