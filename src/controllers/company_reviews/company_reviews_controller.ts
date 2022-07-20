import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { Traveler } from '../../entities/Traveler.entity'
import { CompanyReview } from '../../entities/CompanyReview.entity'
import { companyReviewValidation } from '../../helpers/validations/company-review.validation'

const listCompaniesReviews = async (req: Request, res: Response) => {
	const companies_reviews: CompanyReview[] =
		await AppDataSource.manager.find<CompanyReview>(CompanyReview, {
			relations: ['traveler', 'company'],
		})

	sendSuccessResponse<CompanyReview[]>(res, companies_reviews)
}

const showCompanyReviews = async (req: Request, res: Response) => {
	const company_id: number | undefined = +req.params.id

	const company_reviews: CompanyReview[] | null =
		await AppDataSource.manager.find<CompanyReview>(CompanyReview, {
			where: {
				company: { id: company_id },
			},
			relations: ['traveler', 'company'],
		})

	if (company_reviews) {
		sendSuccessResponse<CompanyReview[]>(res, company_reviews)
	} else {
		sendNotFoundResponse(res)
	}
}

const createCompanyReview = async (req: Request, res: Response) => {
	try {
		const userId = getUserIdFromToken(req)
		// console.log(userId) //4
		if (userId) {
			const currentTravelerUser: Traveler | null =
				await AppDataSource.manager.findOne<Traveler>(Traveler, {
					where: {
						user: { id: userId },
					},
				})

			if (currentTravelerUser) {
				const currentTravelerId = currentTravelerUser.id
				// console.log(currentTravelerId) //2

				const requestedCompanyId = req.body?.companyId
				// console.log(requestedCycleId)

				const company_review: CompanyReview | null =
					await AppDataSource.manager.findOne<CompanyReview>(CompanyReview, {
						where: {
							traveler: { id: currentTravelerId },
							company: { id: requestedCompanyId },
						},
					})
				// console.log(cycle_review) //null

				if (!company_review) {
					const validation: CompanyReview =
						await companyReviewValidation.validateAsync(req.body, {
							abortEarly: false,
						})

					const companyReview =
						await AppDataSource.manager.create<CompanyReview>(CompanyReview, {
							rating: validation.rating,
							review: validation.review,
							companyId: requestedCompanyId,
							travelerId: currentTravelerId,
						})
					await AppDataSource.manager.save(companyReview)

					sendSuccessResponse<CompanyReview>(res, companyReview)
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

const deleteCompanyReview = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		await AppDataSource.manager.delete<CompanyReview>(CompanyReview, {
			id,
		})
		sendSuccessResponse(res)
	} catch (error: any) {
		sendErrorResponse(error, res, StatusCodes.NOT_ACCEPTABLE)
	}
}

export {
	createCompanyReview,
	listCompaniesReviews,
	showCompanyReviews,
	deleteCompanyReview,
}
