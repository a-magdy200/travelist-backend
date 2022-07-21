import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import jwt from 'jsonwebtoken'
import configurations from '../../config/configurations'

export const resetPassword = async (req: Request, res: Response, next: any) => {
	try {
		// const validated: ILoginRequestBody = await loginValidation.validateAsync(
		// 	req.body
		// )

		// todo:: validate
		const token = req.body.token
		const password = req.body.password

		try {
			jwt.verify(token, configurations().reset_password_key)
		} catch (e: any) {
			sendErrorResponse(formatValidationErrors(e), res, StatusCodes.BAD_REQUEST)
		}

		const user = await AppDataSource.manager.findOneByOrFail(User, {
			forgot_password_token: token,
		})

			const salt = await bcrypt.genSalt(10)

			const update_password = await bcrypt.hash(password, salt)

			const updated_pass_success = await AppDataSource.manager.update(
				User,
				user.id,
				{
					password: update_password,
				}
			)
			if (updated_pass_success) {
				await AppDataSource.manager.update(User, user.id, {
					forgot_password_token: '',
				})
				sendSuccessResponse(res, user)
			} else {
				sendErrorResponse(
					['failed to update password'],
					res,
					StatusCodes.NOT_ACCEPTABLE
				)
			}
		
	} catch (e: any) {
		sendErrorResponse(
			formatValidationErrors(e),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
