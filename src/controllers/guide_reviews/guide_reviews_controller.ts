import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { Traveler } from '../../entities/Traveler.entity'
import { GuideReview } from '../../entities/GuideReview.entity'
import { guideReviewValidation } from '../../helpers/validations/guide-review.validation'
import { NotificationEnum } from '../../helpers/enums/notification.enum'
import notify from '../../helpers/common/notify'

const listGuidesReviews = async (req: Request, res: Response) => {
	try {
		const guides_reviews: GuideReview[] =
			await AppDataSource.manager.find<GuideReview>(GuideReview, {
				relations: ['traveler', 'guide'],
			})

		sendSuccessResponse<GuideReview[]>(res, guides_reviews)
	} catch (e: any) {
		sendErrorResponse(formatValidationErrors(e), res, StatusCodes.BAD_REQUEST)
	}
}

const showGuideReviews = async (req: Request, res: Response) => {
	const guide_id: number | undefined = +req.params.id
	try {
		const guide_reviews: GuideReview[] | null =
			await AppDataSource.manager.find<GuideReview>(GuideReview, {
				where: {
					guide: { id: guide_id },
				},
				relations: ['traveler', 'guide'],
			})

		if (guide_reviews) {
			sendSuccessResponse<GuideReview[]>(res, guide_reviews)
		} else {
			sendNotFoundResponse(res)
		}
	} catch (e: any) {
		sendErrorResponse(formatValidationErrors(e), res, StatusCodes.BAD_REQUEST)
	}
}

const createGuideReview = async (req: Request, res: Response) => {
	try {
		const userId = getUserIdFromToken(req)
		if (userId) {
			const currentTravelerUser: Traveler | null =
				await AppDataSource.manager.findOne<Traveler>(Traveler, {
					where: {
						user: { id: userId },
					},
				})

			if (currentTravelerUser) {
				const currentTravelerId = currentTravelerUser.id

				const requestedGuideId = req.body?.guideId

				const guide_review: GuideReview | null =
					await AppDataSource.manager.findOne<GuideReview>(GuideReview, {
						where: {
							traveler: { id: currentTravelerId },
							guide: { id: requestedGuideId },
						},
					})

				if (!guide_review) {
					const validation: GuideReview =
						await guideReviewValidation.validateAsync(req.body, {
							abortEarly: false,
						})

					const guideReview = await AppDataSource.manager.create<GuideReview>(
						GuideReview,
						{
							rating: validation.rating,
							review: validation.review,
							guideId: requestedGuideId,
							travelerId: currentTravelerId,
						}
					)
					await AppDataSource.manager.save(guideReview)

					sendSuccessResponse<GuideReview>(res, guideReview)

					const traveler: Traveler | null =
						await AppDataSource.manager.findOneOrFail<Traveler>(Traveler, {
							where: {
								id: requestedGuideId,
							},
						})

					notify({
						type: NotificationEnum.TRAVELER_REVIEWED_GUIDE,
						userId: traveler.userId,
						content: `New traveler has been reviewed you as a Guide`,
						title: 'Guide Review',
					})
				} else {
					sendNotFoundResponse(res, [
						'Traveler already has reviewed this guide',
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

const deleteGuideReview = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id

		const guide_review: GuideReview | null =
			await AppDataSource.manager.findOne<GuideReview>(GuideReview, {
				where: {
					id,
				},
			})

		const travelerGuideId = guide_review?.guideId
		// const ownerTravelerId = guide_review?.travelerId

		const travelerGuide: Traveler | null =
			await AppDataSource.manager.findOne<Traveler>(Traveler, {
				where: {
					id: travelerGuideId,
				},
			})

		await AppDataSource.manager.delete<GuideReview>(GuideReview, {
			id,
		})

		sendSuccessResponse(res)

		if (travelerGuide) {
			notify({
				type: NotificationEnum.ADMIN_DELETED_GUIDE_REVIEW,
				userId: travelerGuide?.userId,
				content: `Admin deleted a review related to you`,
				title: 'Guide Review deleted',
			})
		}
	} catch (error: any) {
		sendErrorResponse(error, res, StatusCodes.NOT_ACCEPTABLE)
	}
}

export {
	listGuidesReviews,
	showGuideReviews,
	deleteGuideReview,
	createGuideReview,
}
