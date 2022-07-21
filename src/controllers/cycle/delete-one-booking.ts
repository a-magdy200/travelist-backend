import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { sendErrorResponse } from "../../helpers/responses/sendErrorResponse";
import { StatusCodes } from "../../helpers/constants/statusCodes";
import { CycleBooking } from '../../entities/CycleBooking';

export const deleteBooking = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		
			await AppDataSource.manager.delete<CycleBooking>(CycleBooking, {
			id,
		})
		sendSuccessResponse(res)
     	
	} catch (error: any) {
		sendErrorResponse(error, res, StatusCodes.NOT_ACCEPTABLE);
	}
}
