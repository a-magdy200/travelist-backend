import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { HotelReview } from '../../entities/HotelReview.entity'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { hotelReviewValidation } from '../../helpers/validations/hotel-review.validation'
import { Traveler } from '../../entities/Traveler.entity'

const listHotelsReviews = async (req: Request, res: Response) => {
	try {
		const hotels_reviews: HotelReview[] =
			await AppDataSource.manager.find<HotelReview>(HotelReview, {
				relations: ['traveler', 'hotel'],
			})

		sendSuccessResponse<HotelReview[]>(res, hotels_reviews)
	}
	catch (e: any) {
		sendErrorResponse(
			formatValidationErrors(e),
			res,
			StatusCodes.BAD_REQUEST
		)
	}
}

const showHotelReviews = async (req: Request, res: Response) => {
	const hotel_id: number | undefined = +req.params.id
	try {
		const hotel_reviews: HotelReview[] | null =
			await AppDataSource.manager.find<HotelReview>(HotelReview, {
				where: {
					hotel: { id: hotel_id },
				},
				relations: ['traveler', 'hotel'],
			})

		if (hotel_reviews) {
			sendSuccessResponse<HotelReview[]>(res, hotel_reviews)
		} else {
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

const createHotelReview = async (req: Request, res: Response) => {
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

				const requestedHotelId = req.body?.hotelId

				const hotel_review: HotelReview | null =
					await AppDataSource.manager.findOne<HotelReview>(HotelReview, {
						where: {
							traveler: { id: currentTravelerId }, //2
							hotel: { id: requestedHotelId }, //1
						},
					})

				if (!hotel_review) {
					const validation: HotelReview =
						await hotelReviewValidation.validateAsync(req.body, {
							abortEarly: false,
						})

					const hotelReview = await AppDataSource.manager.create<HotelReview>(
						HotelReview,
						{
							rating: validation.rating,
							review: validation.review,
							hotelId: requestedHotelId,
							travelerId: currentTravelerId,
						}
					)
					await AppDataSource.manager.save(hotelReview)

					sendSuccessResponse<HotelReview>(res, hotelReview)
				} else {
					sendNotFoundResponse(res, [
						'Traveler already has reviewed this hotel',
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

const deleteHotelReview = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		await AppDataSource.manager.delete<HotelReview>(HotelReview, {
			id,
		})
		sendSuccessResponse(res)
	} catch (error: any) {
		sendErrorResponse(error, res, StatusCodes.NOT_ACCEPTABLE)
	}
}

export {
	listHotelsReviews,
	showHotelReviews,
	createHotelReview,
	deleteHotelReview,
}
