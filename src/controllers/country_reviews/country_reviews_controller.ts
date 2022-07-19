import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { Traveler } from '../../entities/Traveler.entity'
import { CountryReview } from '../../entities/CountryReview.entity'
import { countryReviewValidation } from '../../helpers/validations/country-review.validation'

const listCountriesReviews = async (req: Request, res: Response) => {
	const countries_reviews: CountryReview[] =
		await AppDataSource.manager.find<CountryReview>(CountryReview, {
			relations: ['traveler', 'country'],
		})

	sendSuccessResponse<CountryReview[]>(res, countries_reviews)
}

const showCountryReviews = async (req: Request, res: Response) => {
	const country_id: number | undefined = +req.params.id

	const country_reviews: CountryReview[] | null =
		await AppDataSource.manager.find<CountryReview>(CountryReview, {
			where: {
				country: { id: country_id },
			},
			relations: ['traveler', 'country'],
		})

	if (country_reviews) {
		sendSuccessResponse<CountryReview[]>(res, country_reviews)
	} else {
		sendNotFoundResponse(res)
	}
}

const createCountryReview = async (req: Request, res: Response) => {
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

				const requestedCountryId = req.body?.countryId

				const country_review: CountryReview | null =
					await AppDataSource.manager.findOne<CountryReview>(CountryReview, {
						where: {
							traveler: { id: currentTravelerId }, 
							country: { id: requestedCountryId }, 
						},
					})

				if (!country_review) {
					const validation: CountryReview =
						await countryReviewValidation.validateAsync(req.body, {
							abortEarly: false,
						})

					const countryReview = await AppDataSource.manager.create<CountryReview>(
						CountryReview,
						{
							rating: validation.rating,
							review: validation.review,
							countryId: requestedCountryId,	
							travelerId: currentTravelerId,
						}
					)
					await AppDataSource.manager.save(countryReview)

					sendSuccessResponse<CountryReview>(res, countryReview)
				} else {
					sendNotFoundResponse(res, [
						'Traveler already has reviewed this country',
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

const deleteCountryReview = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		await AppDataSource.manager.delete<CountryReview>(CountryReview, {
			id,
		})
		sendSuccessResponse(res)
	} catch (error: any) {
		sendErrorResponse(error, res, StatusCodes.NOT_ACCEPTABLE);
	}
}

export { createCountryReview, listCountriesReviews, showCountryReviews, deleteCountryReview }
