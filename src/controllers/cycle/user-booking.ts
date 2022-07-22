import { AppDataSource } from "../../config/database/data-source"
import { CycleBooking } from "../../entities/CycleBooking"
import { Traveler } from "../../entities/Traveler.entity"
import { getUserIdFromToken } from "../../helpers/functions/getUserIdFromToken"
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse"
import { sendNotFoundResponse } from "../../helpers/responses/404.response"
import { sendErrorResponse } from "../../helpers/responses/sendErrorResponse"
import { formatValidationErrors } from "../../helpers/functions/formatValidationErrors"
import { StatusCodes } from "../../helpers/constants/statusCodes"

export const showTravelerBookings = async (req: Request, res: Response) => {
    const userId: number = getUserIdFromToken(req)
	try{
    const traveler = await AppDataSource.getRepository(Traveler).findOneOrFail({
		where: {
			userId
		},
	})
	if(traveler){

    const bookings:CycleBooking[]  = await AppDataSource.getRepository(CycleBooking).find({

        where:{
            travelers:{id:traveler.id},
          },
          relations:["cycle","cycle.program", "cycle.program.company"]

       })
       sendSuccessResponse<CycleBooking[]>(res, bookings)

    }
    else
    {
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
