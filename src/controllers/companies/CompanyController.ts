import { Request, response, Response } from 'express'
import e, { RequestHandler } from 'express'
import { Company } from '../../entities/Company.entity'
import { AppDataSource } from '../../config/database/data-source'
import { NotFoundResponse } from '../../helpers/responses/404.response'
import { companyValidation } from '../../helpers/validations/company.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { UPLOAD_DIRECTORY } from '../../helpers/constants/directories'
import { unlinkSync } from 'fs'
 import { returnId } from '../../helpers/functions/returnToken'
const listCompanies = async (req: Request, res: Response) => {
	const companies: Company[] = await AppDataSource.manager.find<Company>(
		Company,
		{}
	)
	res.json({
		success: true,
		data: companies,
	})
}

const viewCompanyProfile: RequestHandler = async (req, res) => {
	const company = await AppDataSource.getRepository(Company).findOne({
		where: {
			id: parseInt(req.params.id),
		},
		relations: {
			user: true,
		},
	})

	const userId = returnId(req, res)
	// view My company profile
	if (company) {
		if (company?.user.id == userId) {
			res.json({
				success: true,
				data: [company],
			})
		}
		// view other company profile
		else {
			res.json({
				success: true,
				data: [
					company?.description,
					company?.programs,
					company?.cover_picture,
					company?.rate,
				],
			})
		}
	} else {
		res
			.status(404)
			.json({ success: false, message: 'There is no company with this id' })
	}
}
const editCompanyProfile = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		const validation: Company = await companyValidation.validateAsync(
			req.body,
			{ abortEarly: false }
		)
		const updateResult = await AppDataSource.manager.update<Company>(
			Company,
			{
				id,
			},
			validation
		)

		res.json({
			success: updateResult.affected === 1,
		})
	} catch (error: any) {
		res.json(formatValidationErrors(error))
	}
}
const uploadCoverPicture = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const company: Company | null =
		await AppDataSource.manager.findOneBy<Company>(Company, {
			id,
		})
	if (company && req.file?.filename) {
		// Remove `uploads/` from path string
		const oldProfilePicture = company.cover_picture
		if (oldProfilePicture && oldProfilePicture !== '') {
			await unlinkSync(`${UPLOAD_DIRECTORY}${oldProfilePicture}`)
		}
		const path = `${req.file.destination}${req.file.filename}`.replace(
			UPLOAD_DIRECTORY,
			''
		)
		company.cover_picture = path
		await company.save()
		res.json({
			success: true,
			path,
		})
	} else {
		res.json(NotFoundResponse)
	}
}

export {
	listCompanies,
    viewCompanyProfile,
	editCompanyProfile,
	uploadCoverPicture,
}
