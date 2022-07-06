import { Request, Response } from 'express'
import e, { RequestHandler } from 'express'
import { Company } from '../entities/Company.entity'
import { AppDataSource } from '../config/database/data-source'
import { NotFoundResponse } from '../helpers/responses/404.response'
import { companyValidation } from '../helpers/validations/company.validation'
import { formatValidationErrors } from '../helpers/functions/formatValidationErrors'
import { UPLOAD_DIRECTORY } from '../helpers/constants/directories'
import { unlinkSync } from 'fs'
// export const displayAllCompanies: RequestHandler = async (req, res, next) => {
// 	const companies = await AppDataSource.getRepository(Company).find()
// 	res.json(companies)
// 	console.log('get all employees')
// }
const listCompanies = async (req: Request, res: Response) => {
	const hotels: Company[] = await AppDataSource.manager.find<Company>(Company, {
		// withDeleted: true, // to return soft deleted records
	})
	res.json({
		success: true,
		data: hotels,
	})
}
// export const displayByCompany: RequestHandler = async (req, res) => {
//   const results = await AppDataSource.getRepository(Company).findOneBy({
//     id: parseInt(req.params.id),
//   });
//   // if(!results) res.status(404).send('The Company with the given id was not found');
//   res.send(results);
// };
const viewCompanyProfile: RequestHandler = async (req, res) => {
	const company = await AppDataSource.getRepository(Company).findOne({
		where: {
			id: parseInt(req.params.id),
		},
		relations: {
			user: true,
		},
	})
	const userFromToken = {
		id: 3,
	}
	let returnvalue
	if (company?.id == userFromToken.id) {
		// view my profile as company
		returnvalue = {
			identification: '',
			description: '',
			rate: '',
			cover_picture: '',
			user: '',
		}
	}
	// view other company profile
	else {
		returnvalue = {
			identification: '',
			description: '',
		}
	}
	res.send(returnvalue)
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
// export const editCompanyData: RequestHandler = async (req, res) => {
// 	const user = await AppDataSource.getRepository(Company).findOneBy({
// 		id: parseInt(req.params.id),
// 	})
// 	if (user?.id) {
// 		Company.merge(user, req.body)
// 		const results = await AppDataSource.getRepository(Company).update(
// 			user.id,
// 			user
// 		)
// 		res.send('Company updated successfully')
// 	} else {
// 		console.log('no user found')
// 	}
// }

const uploadCoverPicture = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const company: Company | null =
		await AppDataSource.manager.findOneBy<Company>(Company, {
			id,
		})
	if (company && req.file?.filename) {
		// Remove `uploads/` from path string
		const oldCoverPicture = company.cover_picture
		if (oldCoverPicture && oldCoverPicture !== '') {
			await unlinkSync(`${UPLOAD_DIRECTORY}${oldCoverPicture}`)
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
export { listCompanies, viewCompanyProfile, editCompanyProfile }
