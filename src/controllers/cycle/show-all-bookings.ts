import { AppDataSource } from "../../config/database/data-source"
import { CycleBooking } from "../../entities/CycleBooking"
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse"
import { sendNotFoundResponse } from "../../helpers/responses/404.response"

export const showBookings = async (req: Request, res: Response) => {

    const bookings: CycleBooking[] = await AppDataSource.manager.find<CycleBooking>(CycleBooking, {
        relations: ["cycle", "cycle.program","travelers","travelers.user"]
    })
    if (bookings) {
        sendSuccessResponse<CycleBooking[]>(res, bookings)

    }
    else {
        sendNotFoundResponse(res)

    }

}
