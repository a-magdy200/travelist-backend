import { StatusCodes } from "../../helpers/constants/statusCodes"
import { formatValidationErrors } from "../../helpers/functions/formatValidationErrors"
import { sendErrorResponse } from "../../helpers/responses/sendErrorResponse"
import { Request, Response } from 'express'
import { bookingValidation } from "../../helpers/validations/book-cycle.validation"
import { IBookInterface } from "../../helpers/interfaces/IBook.interface"
import { getUserIdFromToken } from "../../helpers/functions/getUserIdFromToken"
import { AppDataSource } from "../../config/database/data-source"
import { Cycle } from "../../entities/Cycle.entity"
import { Traveler } from "../../entities/Traveler.entity"
import { CycleBooking } from "../../entities/CycleBooking"
import { User } from "../../entities/User.entity"
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse"

export const bookCycle = async (req: Request, res: Response) => {
    try
    {
        const bodyObject: IBookInterface = await bookingValidation.validateAsync(req.body, {
			abortEarly: false,
		})
        const userId :number=getUserIdFromToken(req)

        const cycle = await AppDataSource.getRepository(Cycle).findOne({
            where: {
                id:bodyObject.cycleId
            },
        })

     /*   const user = await AppDataSource.getRepository(User).findOne({
            where: {
                id:userId
            },
        })*/

        const traveler = await AppDataSource.getRepository(Traveler).findOne({
            where: {
                userId:userId
            },
        })
        const booking = await AppDataSource.manager.create<CycleBooking>(CycleBooking,bodyObject)
        if(traveler&&cycle)
      { 
        console.log(traveler)
       //  booking.travelers.push(traveler)
       booking.travelers=traveler
       booking.cycle=cycle
       await AppDataSource.manager.save(booking)
		sendSuccessResponse<CycleBooking>(res, booking)

      }  
      else
      {
        const error:any=['not found']
        sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
      }

    }
    catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}

}