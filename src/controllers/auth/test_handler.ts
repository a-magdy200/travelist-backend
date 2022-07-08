import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
import { Request, Response } from 'express'

const listUsers = async (req: Request, res: Response, next: any) => {

	const users = await AppDataSource.manager.find<User[]>(User, {})

	return res.status(200).json({
		success: true,
		users,
	})
}

export { listUsers }
