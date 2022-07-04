import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
import jwt from 'jsonwebtoken'
const bcrypt = require('bcrypt')
import { Request, Response } from 'express'

const login = async (req: Request, res: Response, next: any) => {
	if (req.body.email !== undefined && req.body.password !== undefined) {
		const user: any = await AppDataSource.manager.findOneBy(User, {
			email: req.body.email,
		})

		if (user !== null) {
			const validPassword = await bcrypt.compare(
				req.body.password,
				user.password
			)

			if (validPassword) {
				jwt.sign({ user }, 'secretkey', (err: any, token: any) => {
					res.sendStatus(200).json({
						success: true,
						token,
					})
				})
			} else {
				res.sendStatus(404).json({
					success: false,
					error: 'Incorrect password',
				})
			}
		} else {
			res.sendStatus(404).json({
				success: false,
				error: 'Incorrect email, user not exist',
			})
		}
	} else {
		res.sendStatus(404).json({
			success: false,
			error: 'Missing email or password',
		})
	}
}

export { login }
