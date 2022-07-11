import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { loginValidation } from '../../helpers/validations/login.validation'
import { ILoginRequestBody } from '../../helpers/interfaces/ILoginRequestBody.interface'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'

export const resetPassword = async (req: Request, res: Response, next: any) => {
	try {
		const validated: ILoginRequestBody = await loginValidation.validateAsync(
			req.body
		)
		const user = await AppDataSource.manager.findOneBy(User, {
			email: validated.email,
		})

		if (user) {
			const salt = await bcrypt.genSalt(10)

			user.password = await bcrypt.hash(validated.password, salt)
			await AppDataSource.manager.save(user)

			sendSuccessResponse(res, user)
		} else {
			sendErrorResponse(
				['Missing password or user not found'],
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
