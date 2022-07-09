import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
import jwt from 'jsonwebtoken'
const bcrypt = require('bcrypt')
import { Request, Response } from 'express'
import { formatErrorResponse } from '../../helpers/functions/formatErrorResponse'
import { ILoginRequestBody } from '../../helpers/interfaces/ILoginRequestBody.interface'
import { valid } from 'joi'
import configurations from '../../config/configurations'
import { sendAuthenticationResponse } from '../../helpers/functions/sendAuthenticationResponse'

const login = async (req: Request, res: Response, next: any) => {
	const requestBody: ILoginRequestBody = { ...req.body }

	const requestedEmail = req.body.email
	const requestedPassword = req.body.password

	if (requestedEmail !== undefined && requestedPassword !== undefined) {
		const user = await AppDataSource.manager.findOneBy<User>(User, {
			email: requestedEmail,
		})

		if (user !== null) {
			const validPassword = await bcrypt.compare(
				requestedPassword,
				user.password
			)
			if (validPassword) {
				sendAuthenticationResponse(user, res)
			} else {
				return res.status(404).json(formatErrorResponse(['Incorrect password']))
			}
		} else {
			return res
				.status(404)
				.json(formatErrorResponse(['Incorrect email, user does not exist']))
		}
	} else {
		return res
			.status(404)
			.json(formatErrorResponse(['Missing email or password']))
	}
}

export { login }
