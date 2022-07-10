import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
import { ForgetPasswordCode } from '../../entities/ForgetPasswordCode.entity'
import { Request, Response } from 'express'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { VERIFY_CODE_SUBJECT } from '../../helpers/constants/emailParams'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { forgetPasswordEmail } from '../../helpers/emails/forget-password.email'
import { emailHandler } from '../../helpers/common/email-handler'

export const forgetPassword = async (req: Request, res: Response) => {
	if (req.body.email !== undefined) {
		const user = await AppDataSource.manager.findOneBy(User, {
			email: req.body.email,
		})

		if (user) {
			const email = user.email
			const code = Math.random().toString(20).substring(2, 12)

			const user_password_forget = await AppDataSource.manager.findOneBy(
				ForgetPasswordCode,
				{
					email,
				}
			)

			if (user_password_forget) {
				user_password_forget.code = code
				user_password_forget.save()
			} else {
				await AppDataSource.manager.insert<ForgetPasswordCode>(
					ForgetPasswordCode,
					{
						email,
						code,
					}
				)
			}
			await emailHandler({
				email,
				subject: VERIFY_CODE_SUBJECT,
				html: forgetPasswordEmail(code),
			})
			sendSuccessResponse(res)
		} else {
			sendErrorResponse(
				['Invalid email, user not exist'],
				res,
				StatusCodes.NOT_FOUND
			)
		}
	} else {
		sendErrorResponse(['Missing email'], res, StatusCodes.NOT_ACCEPTABLE)
	}
}
