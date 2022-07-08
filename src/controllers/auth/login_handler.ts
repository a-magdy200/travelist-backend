import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
import jwt from 'jsonwebtoken'
const bcrypt = require('bcrypt')
import { Request, Response } from 'express'
import { formatErrorResponse } from '../../helpers/functions/formatErrorResponse'

const login = async (req: Request, res: Response, next: any) => {

	// const requestBody : ILoginRequestBody = {...req.body};

	if (req.body.email !== undefined && req.body.password !== undefined) {
		const user = await AppDataSource.manager.findOneBy<User>(User, {
			email: req.body.email,
		})

		if (user !== null) {
			const validPassword = await bcrypt.compare(
				req.body.password,
				user.password
			)

			if (validPassword) {
				jwt.sign({ user }, 'secretkey', { expiresIn: '1h' },(err: any, token: any) => {
					return res.status(200).json({
						success: true,
						data: {
							access_token: token,
							user: {
								name: user.name,
								profile_picture: user.profile_picture,
							},
						},
					})
				})
			} else {
				return res.status(404).json(formatErrorResponse(["Incorrect password"]));
			}
		} else {
			return res.status(404).json(formatErrorResponse(["Incorrect email, user does not exist"]));
		}
	} else {
		return res.status(404).json(formatErrorResponse(["Missing email or password"]));
	}
}

export { login }
