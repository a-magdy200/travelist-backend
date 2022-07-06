import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
const bcrypt = require('bcrypt')
import { Request, Response } from 'express'
import { userValidation } from '../../helpers/validations/user.validation'
import jwt from 'jsonwebtoken'

const register = async (req: Request, res: Response, next: any) => {
	try {

		const existedUser = await AppDataSource.manager.findOneBy<User>(User, {
			email: req.body.email,
		})

		// console.log(existedUser);

		if (existedUser == null){
			// const validation = await userValidation.validateAsync(req.body, {
			// 	abortEarly: false,
			// })

			const salt = await bcrypt.genSalt(10)
			const pass = await bcrypt.hash(req.body.password, salt)
			const user = await AppDataSource.manager.insert<User>(User, {
				name: req.body.name,
				email: req.body.email,
				password: pass,
				address: req.body.address,
				type: req.body.type,
			})

			jwt.sign({ user }, 'secretkey', { expiresIn: '1h' },(err: any, token: any) => {
				return res.status(200).json({
					success: true,
					data: user.generatedMaps,
					// data: user,
					token,
				})
			});
	    }else{
			return res.status(404).json({
				success: false,
				error: 'User is exist',
			})
		}
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			// errors: error.details.map((e: Error) => e.message),
			// errors:error,
		})
	}
}

export { register }
