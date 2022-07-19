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
        const cycle = await AppDataSource.getRepository(Cycle).findOne({
            where: {
                id:bodyObject.cycleId
            },

        })

        const userId :number=getUserIdFromToken(req)
        const traveler = await AppDataSource.getRepository(Traveler).findOne({
            where: {
                userId:userId
            },
            relations: ["user"],

        })

        const previousCycle = await AppDataSource.getRepository(CycleBooking).findOne({
            where: {
              travelers:{id:traveler?.id},
              cycle:{id:cycle?.id}
            },
        })

        console.log(!previousCycle)

        if(traveler&& cycle && !previousCycle&&cycle.current_seats<cycle.max_seats )
      { 
        console.log(cycle)
       const booking = await AppDataSource.manager.create<CycleBooking>(CycleBooking,bodyObject)
       // booking.travelers.push(traveler)
       cycle.current_seats++
       booking.travelers=traveler
       booking.cycle=cycle
       await AppDataSource.manager.save(booking)
       await AppDataSource.manager.save(cycle)

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