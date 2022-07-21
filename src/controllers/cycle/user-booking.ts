import { AppDataSource } from "../../config/database/data-source"
import { CycleBooking } from "../../entities/CycleBooking"
import { Traveler } from "../../entities/Traveler.entity"
import { getUserIdFromToken } from "../../helpers/functions/getUserIdFromToken"
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse"
import { sendNotFoundResponse } from "../../helpers/responses/404.response"

export const showTravelerBookings = async (req: Request, res: Response) => {
    const userId: number = getUserIdFromToken(req)
	const traveler = await AppDataSource.getRepository(Traveler).findOne({
		where: {
			userId: userId
		},
	})
	if(traveler){	
    
    const bookings:CycleBooking[]  = await AppDataSource.getRepository(CycleBooking).find({
        
        where:{
            travelers:{id:traveler.id},
          },
          relations:["cycle","cycle.program"]
    
       })
       sendSuccessResponse<CycleBooking[]>(res, bookings)
    
    }
    else
    {
        sendNotFoundResponse(res)

    }
		
}
	