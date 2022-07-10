import { RequestHandler } from 'express'
import { User } from '../../entities/User.entity'
import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { userValidation } from '../../helpers/validations/user.validation'
import { passwordValidation } from '../../helpers/validations/password.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { getUserIdFromToken } from "../../helpers/functions/getUserIdFromToken";
import { Traveler } from "../../entities/Traveler.entity";
import { unlinkSync } from "fs";
import { UPLOAD_DIRECTORY } from "../../helpers/constants/directories";
import { sendNotFoundResponse } from "../../helpers/responses/404.response";
const viewUserProfile: RequestHandler = async (req, res) => {
	const id = getUserIdFromToken(req);
	const user = await AppDataSource.getRepository(User).findOneByOrFail({
		id
	})
	sendSuccessResponse<User>(res, user);
}
const uploadProfilePicture = async (req: Request, res: Response) => {
	if (req.file) {
		const id = getUserIdFromToken(req);
		const user = await AppDataSource.manager.findOneByOrFail(User, { id });
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
		sendSuccessResponse<string>(res, path)
	} else {
		sendErrorResponse(["Invalid file upload"], res, StatusCodes.NOT_ACCEPTABLE)
	}

}

const editUserProfile = async (req: Request, res: Response) => {
	try {
		const id = getUserIdFromToken(req);
		const validation: User = await userValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		await AppDataSource.manager.update<User>(
			User,
			{
				id,
			},
			validation
		)

		sendSuccessResponse(res);
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
		const id = getUserIdFromToken(req);

		const password_validation: User = await passwordValidation.validateAsync(
			req.body,
			{ abortEarly: false }
		)
		await AppDataSource.manager.update<User>(
			User,
			id,
			{ password: password_validation.password }
		)

		sendSuccessResponse(res)
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}

export { uploadProfilePicture, viewUserProfile, editUserProfile, updateUserPassword }
