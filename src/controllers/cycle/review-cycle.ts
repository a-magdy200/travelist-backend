import { StatusCodes } from "../../helpers/constants/statusCodes"
import { formatValidationErrors } from "../../helpers/functions/formatValidationErrors"
import { sendErrorResponse } from "../../helpers/responses/sendErrorResponse"
import { Request, Response } from "express";
import { ICycleReviewInterface } from "../../helpers/interfaces/ICycleReview.interface";
import { cycleReviewValidation } from "../../helpers/validations/review-cycle.validation";
import { getUserIdFromToken } from "../../helpers/functions/getUserIdFromToken";
import { AppDataSource } from "../../config/database/data-source";
import { Cycle } from "../../entities/Cycle.entity";
import { Traveler } from "../../entities/Traveler.entity";
import { CycleReview } from "../../entities/CycleReview.entity";

export const reviewCycle = async (req: Request, res: Response) => {

    try
    {

		const bodyObject: ICycleReviewInterface = await cycleReviewValidation.validateAsync(req.body, {
			abortEarly: false,
		})
        const userId :number=getUserIdFromToken(req)

        const cycle = await AppDataSource.getRepository(Cycle).findOne({
            where: {
                id:bodyObject.cycleId
            },
        })

		const traveler = await AppDataSource.getRepository(Traveler).findOne({
            where: {
                userId:userId
            },
        })
		
		const previousReview = await AppDataSource.getRepository(CycleReview).findOne({
			where: {
				//travelerId:traveler.id,
				//cycleId:bodyObject.cycleId

			},
		})

		if(cycle&& traveler)
		{
			
		const review = await AppDataSource.manager.create<CycleReview>(CycleReview,bodyObject)
        review.traveler=traveler
		review.cycle=cycle
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