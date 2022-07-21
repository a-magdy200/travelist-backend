import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
import { Request, Response } from 'express'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { RESET_PASSWORD_SUBJECT } from '../../helpers/constants/emailParams'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { forgetPasswordEmail } from '../../helpers/emails/forget-password.email'
import { emailHandler } from '../../helpers/common/email-handler'
import configurations from '../../config/configurations'
import jwt from 'jsonwebtoken'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'

export const forgetPassword = async (req: Request, res: Response) => {
	try {
		// todo::interface and validate email only

		const user = await AppDataSource.manager.findOneByOrFail(User, {
			email: req.body.email,
		})

		const email = user.email

		const token = jwt.sign(
			{ user: user.id },
			configurations().reset_password_key,
			{ expiresIn: '15m' }
		)
		try {
			await AppDataSource.manager.update(User, user.id, {
				forgot_password_token: token,
			})
		} catch (e: any) {
			sendErrorResponse(
				formatValidationErrors(e),
				res,
				StatusCodes.BAD_REQUEST
			)
		}

		await emailHandler({
			email,
			subject: RESET_PASSWORD_SUBJECT,
			html: forgetPasswordEmail(token),
		})
		sendSuccessResponse(res)


	}
	catch (e: any) {
		sendErrorResponse(
			formatValidationErrors(e),
			res,
			StatusCodes.BAD_REQUEST
		)
	}
}
