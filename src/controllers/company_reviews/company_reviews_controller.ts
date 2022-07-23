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
import notify from '../../helpers/common/notify'
import { NotificationEnum } from '../../helpers/enums/notification.enum'
import { Company } from '../../entities/Company.entity'

const listCompaniesReviews = async (req: Request, res: Response) => {
	try {
		const companies_reviews: CompanyReview[] =
			await AppDataSource.manager.find<CompanyReview>(CompanyReview, {
				relations: ['traveler', 'company'],
			})

		sendSuccessResponse<CompanyReview[]>(res, companies_reviews)
	} catch (e: any) {
		sendErrorResponse(formatValidationErrors(e), res, StatusCodes.BAD_REQUEST)
	}
}

const showCompanyReviews = async (req: Request, res: Response) => {
	const company_id: number | undefined = +req.params.id
	try {
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
	} catch (e: any) {
		sendErrorResponse(formatValidationErrors(e), res, StatusCodes.BAD_REQUEST)
	}
}

const createCompanyReview = async (req: Request, res: Response) => {
	try {
		const userId = getUserIdFromToken(req)
		if (userId) {
			const currentTravelerUser: Traveler | null =
				await AppDataSource.manager.findOneOrFail<Traveler>(Traveler, {
					where: {
						user: { id: userId },
					},
				})

			const currentTravelerId = currentTravelerUser.id

			const requestedCompanyId = req.body?.companyId

			const company_review: CompanyReview | null =
				await AppDataSource.manager.findOne<CompanyReview>(CompanyReview, {
					where: {
						traveler: { id: currentTravelerId },
						company: { id: requestedCompanyId },
					},
				})

			if (!company_review) {
				const validation: CompanyReview =
					await companyReviewValidation.validateAsync(req.body, {
						abortEarly: false,
					})

				const companyReview = await AppDataSource.manager.create<CompanyReview>(
					CompanyReview,
					{
						rating: validation.rating,
						review: validation.review,
						companyId: requestedCompanyId,
						travelerId: currentTravelerId,
					}
				)
				await AppDataSource.manager.save(companyReview)

				sendSuccessResponse<CompanyReview>(res, companyReview)

				const company: Company | null =
					await AppDataSource.manager.findOneOrFail<Company>(Company, {
						where: {
							id: requestedCompanyId,
						},
					})

				notify({
					type: NotificationEnum.TRAVELER_REVIEWED_COMPANY,
					userId: company.userId,
					content: `New traveler has been reviewed your company`,
					title: 'Company Review',
				})
			} else {
				sendNotFoundResponse(res, [
					'Traveler already has reviewed this comapny',
				])
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

		const company_review: CompanyReview | null =
			await AppDataSource.manager.findOne<CompanyReview>(CompanyReview, {
				where: {
					id,
				},
			})

		const companyId = company_review?.companyId

		await AppDataSource.manager.delete<CompanyReview>(CompanyReview, {
			id,
		})

		const company: Company | null =
			await AppDataSource.manager.findOne<Company>(Company, {
				where: {
					id: companyId,
				},
			})

		sendSuccessResponse(res)

		if (company) {
			notify({
				type: NotificationEnum.ADMIN_DELETED_COMPANY_REVIEW,
				userId: company.userId,
				content: `Admin deleted a review related to you`,
				title: 'Company Review deleted',
			})
		}
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
