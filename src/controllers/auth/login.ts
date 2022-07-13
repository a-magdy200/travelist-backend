import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { ILoginRequestBody } from '../../helpers/interfaces/ILoginRequestBody.interface'
import { sendAuthenticationResponse } from '../../helpers/responses/sendAuthenticationResponse'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { loginValidation } from '../../helpers/validations/login.validation'
import { StatusCodes } from '../../helpers/constants/statusCodes'

export const login = async (req: Request, res: Response) => {
	try {
		const requestBody: ILoginRequestBody = await loginValidation.validateAsync(
			req.body
		)
		const existingUser = await AppDataSource.manager.findOne<User>(User, {
			where: {
				email: requestBody.email,
			},
			select: ['password', 'email'],
		})
		if (existingUser) {
			const validPassword = await bcrypt.compare(
				requestBody.password,
				existingUser.password
			)
			if (validPassword) {
				const user = await AppDataSource.manager.findOneByOrFail(User, {
					email: requestBody.email,
				})
				sendAuthenticationResponse(user, res)
			} else {
				sendErrorResponse(
					['Incorrect password'],
					res,
					StatusCodes.NOT_ACCEPTABLE
				)
			}
		} else {
			sendErrorResponse(
				['Incorrect email, user does not exist'],
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
