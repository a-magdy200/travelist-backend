import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
const bcrypt = require('bcrypt')
import { Request, Response } from 'express'
import { formatErrorResponse } from '../../helpers/functions/formatErrorResponse'

const resetPassword = async (req: Request, res: Response, next: any) => {
	if (req.body.email !== undefined) {
		const user = await AppDataSource.manager.findOneBy(User, {
			email: req.body.email,
		})

		if (user !== null && req.body.password !== undefined) {
			// validate
			const salt = await bcrypt.genSalt(10)
			const pass = await bcrypt.hash(req.body.password, salt)

			user.password = pass
			await AppDataSource.manager.save(user)

			res.sendStatus(200).json({
				success: true,
				user,
			})
		} else {
			return res
				.sendStatus(404)
				.json(formatErrorResponse(['Missing password or user not found']))
		}
	} else {
		return res.sendStatus(404).json(formatErrorResponse(['Missing email']))
	}
}

export { resetPassword }
