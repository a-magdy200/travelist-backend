import { RequestHandler } from 'express'
import { User } from '../../entities/User.entity'
import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { NotFoundResponse } from '../../helpers/responses/404.response'
import { userValidation } from '../../helpers/validations/user.validation'
import { passwordValidation } from '../../helpers/validations/password.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { UPLOAD_DIRECTORY } from '../../helpers/constants/directories'
import { unlinkSync } from 'fs'
const viewUserProfile: RequestHandler = async (req, res) => {
	const user = await AppDataSource.getRepository(User).findOne({
		where: {
			id: parseInt(req.params.id),
		},
		relations: {
			friends:true
			},
	})
}
	// const userFromToken = {
	// 	id: 3,
	// }
	// let returnvalue
	// view my profile 
	// user?.find({
	// 	where:[
	// 		{
	// 		//userId_1:userFromToken.id	
	// 		// userId_2 : parseInt(req.params.id)
	// 		},
	// 	{
	// 		//userId_2:userFromToken.id	
	// 		// userId_1 : parseInt(req.params.id)
	// 	}]
	// })

		// res.json({
		// 	success: true,
		// 	data: user,
		// })
	

	// view other friend profile
	// else {
	// 	returnvalue = {
	// 		identification: '',
	// 		description: '',
	// 	}
	// }
// 	res.send(returnvalue)

const editUserProfile = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		const validation: User = await userValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const updateResult = await AppDataSource.manager.update<User>(
			User,
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
const updateUserPassword = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		const password_validation: User = await passwordValidation.validateAsync(
			req.body,
			{ abortEarly: false }
		)
		const updateResult = await AppDataSource.manager.update<User>(
			User,

			id,
			{ password: req.body.password }
		)

		res.json({
			success: updateResult.affected === 1,
		})
	} catch (error: any) {
		res.json(formatValidationErrors(error))
	}
}
const uploadProfilePicture = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const user: User | null =
		await AppDataSource.manager.findOneBy<User>(User, {
			id,
		})
	if (user && req.file?.filename) {
		// Remove `uploads/` from path string
		const oldCoverPicture = user.profile_picture
		if (oldCoverPicture && oldCoverPicture !== '') {
			await unlinkSync(`${UPLOAD_DIRECTORY}${oldCoverPicture}`)
		}
		const path = `${req.file.destination}${req.file.filename}`.replace(
			UPLOAD_DIRECTORY,
			''
		)
		user.profile_picture = path
		await user.save()
		res.json({
			success: true,
			path,
		})
	} else {
		res.json(NotFoundResponse)
	}
}

export {viewUserProfile,editUserProfile, updateUserPassword,uploadProfilePicture }
