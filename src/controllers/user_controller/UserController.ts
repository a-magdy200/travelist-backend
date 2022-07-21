import { RequestHandler } from 'express'
import { User } from '../../entities/User.entity'
import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { userEditValidation } from '../../helpers/validations/userEdit.validation'
import { passwordValidation } from '../../helpers/validations/password.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { unlinkSync } from 'fs'
import { UPLOAD_DIRECTORY } from '../../helpers/constants/directories'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
const viewUserProfile: RequestHandler = async (req, res) => {
	try {
		const id = getUserIdFromToken(req)
		const user = await AppDataSource.getRepository(User).findOneByOrFail({
			id,
		})
		sendSuccessResponse<User>(res, user)
	}
	catch (e: any) {
		sendErrorResponse(
			formatValidationErrors(e),
			res,
			StatusCodes.BAD_REQUEST
		)
	}
}

const editUserProfile = async (req: Request, res: Response) => {
	try {
		const id = getUserIdFromToken(req)
		const validation: User = await userEditValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const updateResult = await AppDataSource.manager.update<User>(
			User,
			{
				id,
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
const updateUserPassword = async (req: Request, res: Response) => {
	try {
		const id = getUserIdFromToken(req)

		const password_validation: User = await passwordValidation.validateAsync(
			req.body,
			{ abortEarly: false }
		)
		await AppDataSource.manager.update<User>(User, id, {
			password: password_validation.password,
		})

		sendSuccessResponse(res)
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
const uploadProfilePicture = async (req: Request, res: Response) => {
	try{
	const id: number | undefined = +req.params.id
	const user: User | null = await AppDataSource.manager.findOneByOrFail<User>(User, {
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
		res.json(sendNotFoundResponse)
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

const getUserId = async (req: Request, res: Response) => {
	try {
		const id = getUserIdFromToken(req);
		const user = await AppDataSource.getRepository(User).findOneByOrFail({
			id
		})
		sendSuccessResponse<User>(res, user);
	}
	catch (error: any) {
		sendNotFoundResponse(res)
	}
}
export {
	uploadProfilePicture,
	viewUserProfile,
	editUserProfile,
	updateUserPassword,
	getUserId
}
