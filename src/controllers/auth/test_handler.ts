import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
import { Request, Response } from 'express'

const listUsers = async (req: Request, res: Response, next: any) => {
	// console.log(req.body);

	// to get the request user id //login
	// console.log(req.body.user.id);

	// // to get the request user id //register
	// console.log(req.body.user.raw.insertId);
	// token -decode- req

	const users = await AppDataSource.manager.find<User[]>(User, {})

	return res.status(200).json({
		success: true,
		users,
	})
}

export { listUsers }
