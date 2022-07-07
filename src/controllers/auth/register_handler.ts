import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
const bcrypt = require('bcrypt')
import { Request, Response } from 'express'
import { userValidation } from '../../helpers/validations/user.validation'

const register = async (req: Request, res: Response, next: any) => {
	try {
		// const validation = await userValidation.validateAsync(req.body, {
		// 	abortEarly: false,
		// })

		const salt = await bcrypt.genSalt(10)
		const pass = await bcrypt.hash(req.body.password, salt)
		// validate check mail not exist
		const user = await AppDataSource.manager.insert<User>(User, {
			name: req.body.name,
			email: req.body.email,
			password: pass,
			address: req.body.address,
			type: req.body.type,
		})

		return res.status(200).json({
			success: true,
			user,
		})
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			// errors: error.details.map((e: Error) => e.message),
			// errors:error,
		})
	}
}

export { register }
