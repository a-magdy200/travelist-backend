import { StatusCodes } from "../../helpers/constants/statusCodes"
import { formatValidationErrors } from "../../helpers/functions/formatValidationErrors"
import { sendErrorResponse } from "../../helpers/responses/sendErrorResponse"
import { Request, Response } from "express";

/*export const reviewCycle = async (req: Request, res: Response) => {

    try
    {

    } 
    catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}   
}*/