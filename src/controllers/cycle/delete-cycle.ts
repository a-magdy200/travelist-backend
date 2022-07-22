import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { Cycle } from '../../entities/Cycle.entity'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { sendErrorResponse } from "../../helpers/responses/sendErrorResponse";
import { StatusCodes } from "../../helpers/constants/statusCodes";

export const deleteCycle = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		
			await AppDataSource.manager.delete<Cycle>(Cycle, {
			id,
		})
		sendSuccessResponse(res)
     	
	} catch (error: any) {
		sendErrorResponse(error, res, StatusCodes.NOT_ACCEPTABLE);
	}
}
