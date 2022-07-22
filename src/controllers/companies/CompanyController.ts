import { Request, Response, RequestHandler } from 'express'
import { Company } from '../../entities/Company.entity'
import { AppDataSource } from '../../config/database/data-source'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { companyValidation } from '../../helpers/validations/company.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'

const listCompanies = async (req: Request, res: Response) => {
	try{
	const companies: Company[] = await AppDataSource.manager.find<Company>(
		Company,
		{			relations: ["user"],
	}
	)
	sendSuccessResponse<Company[]>(res, companies)
	}
	catch (e: any) {
		sendErrorResponse(
			formatValidationErrors(e),
			res,
			StatusCodes.BAD_REQUEST
		)
	}
}
const showCompany = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	try{
	const company = await AppDataSource.getRepository(Company).findOneOrFail({
		where: {
			id: parseInt(req.params.id),
		},
		relations: ['user', 'programs', 'programs.cycles','reviews'],
	})
	
		sendSuccessResponse<Company>(res, company)

}
catch (e: any) {
	sendErrorResponse(
		formatValidationErrors(e),
		res,
		StatusCodes.BAD_REQUEST
	)
}
}

const viewCompanyProfile: RequestHandler = async (req, res) => {
	let criteria
	if (req.params.id) {
		criteria = {
			id: +req.params.id,
		}
	} else {
		criteria = {
			userId: getUserIdFromToken(req),
		}
	}
	try{
	const company = await AppDataSource.getRepository(Company).findOneOrFail({
		where: criteria,
		relations: {
			user: true,
			reviews: true,
		},
	})
		sendSuccessResponse<Company>(res, company)
	
}
catch (e: any) {
	sendErrorResponse(
		formatValidationErrors(e),
		res,
		StatusCodes.BAD_REQUEST
	)
}
}
const editCompanyProfile = async (req: Request, res: Response) => {
	try {
		const userId = getUserIdFromToken(req)
		const validation: Company = await companyValidation.validateAsync(
			req.body,
			{ abortEarly: false }
		)
		const updateResult = await AppDataSource.manager.update<Company>(
			Company,
			{
				userId,
			},
			validation
		)
		if (updateResult.affected === 1) {
			sendSuccessResponse(res)
		} else {
			sendErrorResponse(['Failed to update'], res, StatusCodes.NO_CHANGE)
		}
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
export { listCompanies, viewCompanyProfile, editCompanyProfile, showCompany }
