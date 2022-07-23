import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { Traveler } from '../../entities/Traveler.entity'
import { CycleReview } from '../../entities/CycleReview.entity'
import { cycleReviewValidation } from '../../helpers/validations/review-cycle.validation'
import { NotificationEnum } from '../../helpers/enums/notification.enum'
import notify from '../../helpers/common/notify'
import { Cycle } from '../../entities/Cycle.entity'
import { Program } from '../../entities/Program.entity'

const listCyclesReviews = async (req: Request, res: Response) => {
	try {
		const cycles_reviews: CycleReview[] =
			await AppDataSource.manager.find<CycleReview>(CycleReview, {
				relations: ['traveler', 'cycle'],
			})

		sendSuccessResponse<CycleReview[]>(res, cycles_reviews)
	} catch (e: any) {
		sendErrorResponse(formatValidationErrors(e), res, StatusCodes.BAD_REQUEST)
	}
}

const showCycleReviews = async (req: Request, res: Response) => {
	const cycle_id: number | undefined = +req.params.id
	try {
		const cycle_reviews: CycleReview[] | null =
			await AppDataSource.manager.find<CycleReview>(CycleReview, {
				where: {
					cycle: { id: cycle_id },
				},
				relations: ['traveler', 'cycle'],
			})

		if (cycle_reviews) {
			sendSuccessResponse<CycleReview[]>(res, cycle_reviews)
		} else {
			sendNotFoundResponse(res)
		}
	} catch (e: any) {
		sendErrorResponse(formatValidationErrors(e), res, StatusCodes.BAD_REQUEST)
	}
}

const createCycleReview = async (req: Request, res: Response) => {
	try {
		const userId = getUserIdFromToken(req)
		if (userId) {
			const currentTravelerUser: Traveler | null =
				await AppDataSource.manager.findOneOrFail<Traveler>(Traveler, {
					where: {
						user: { id: userId },
					},
				})

			if (currentTravelerUser) {
				const currentTravelerId = currentTravelerUser.id

				const requestedCycleId = req.body?.cycleId

				//only if traveler has booked cycle: new infoCycleReview
				const cycle_review: CycleReview | null =
					await AppDataSource.manager.findOne<CycleReview>(CycleReview, {
						where: {
							traveler: { id: currentTravelerId },
							cycleId: requestedCycleId,
						},
					})

				if (!cycle_review) {
					const validation: CycleReview =
						await cycleReviewValidation.validateAsync(req.body, {
							abortEarly: false,
						})

					const cycleReview = await AppDataSource.manager.create<CycleReview>(
						CycleReview,
						{
							rating: validation.rating,
							review: validation.review,
							cycleId: requestedCycleId,
							travelerId: currentTravelerId,
						}
					)
					await AppDataSource.manager.save(cycleReview)

					sendSuccessResponse<CycleReview>(res, cycleReview)

					const cycle: Cycle | null =
						await AppDataSource.manager.findOneOrFail<Cycle>(Cycle, {
							where: {
								id: requestedCycleId,
							},
							relations: ['program'],
						})

					const programId = cycle.program?.id

					if (programId) {
						const program: Program | null =
							await AppDataSource.manager.findOneOrFail<Program>(Program, {
								where: {
									id: programId,
								},
								relations: ['company'],
							})

						if (program.company) {
							notify({
								type: NotificationEnum.TRAVELER_REVIEWED_CYCLE,
								userId: program.company.userId,
								content: `New traveler has been reviewed your Cycle`,
								title: 'Cycle Review',
							})
						}
					}
				} else {
					sendNotFoundResponse(res, [
						'Traveler already has reviewed this cycle',
					])
				}
			} else {
				sendNotFoundResponse(res, ['current user type is not traveler'])
			}
		} else {
			sendNotFoundResponse(res, ['invalid token or user is not authenticated'])
		}
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}

const deleteCycleReview = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		await AppDataSource.manager.delete<CycleReview>(CycleReview, {
			id,
		})
		sendSuccessResponse(res)
	} catch (error: any) {
		sendErrorResponse(error, res, StatusCodes.NOT_ACCEPTABLE)
	}
}

export {
	createCycleReview,
	listCyclesReviews,
	showCycleReviews,
	deleteCycleReview,
}
