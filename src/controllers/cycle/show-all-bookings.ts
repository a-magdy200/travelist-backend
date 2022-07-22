import { AppDataSource } from "../../config/database/data-source";
import { CycleBooking } from "../../entities/CycleBooking";
import { Request, Response } from "express";
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { sendNotFoundResponse } from "../../helpers/responses/404.response";
import { sendErrorResponse } from "../../helpers/responses/sendErrorResponse";
import { StatusCodes } from "../../helpers/constants/statusCodes";
import { formatValidationErrors } from "../../helpers/functions/formatValidationErrors";
import { Company } from "../../entities/Company.entity";
import { getUserIdFromToken } from "../../helpers/functions/getUserIdFromToken";

export const showBookings = async (req: Request, res: Response) => {

  try{
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
catch (e: any) {
    sendErrorResponse(
        formatValidationErrors(e),
        res,
        StatusCodes.BAD_REQUEST
    )
}

}
export const showCompanyBookings = async (req: Request, res: Response) => {
  try{
  const userId = getUserIdFromToken(req);
    const company: Company = await AppDataSource.manager.findOneOrFail<Company>(Company, {
        relations: ["programs", "programs.cycles", "programs.cycles.bookings", "programs.cycles.bookings.cycle.program", "programs.cycles.bookings.travelers.user"],
        where: {
          userId
        },
    });
    const bookings: CycleBooking[] = [];
    if (company.programs) {
      company.programs.forEach(program => {
        program.cycles?.forEach(cycle => {
          bookings.push(...cycle.bookings);
        });
      });
      if (bookings.length > 1) {
        bookings.sort((a, b) => (b?.id || 0) - (a?.id || 0));
      }
    }
        sendSuccessResponse<CycleBooking[]>(res, bookings)
}
catch (e: any) {
    sendErrorResponse(
        formatValidationErrors(e),
        res,
        StatusCodes.BAD_REQUEST
    )
}

}
