import { Cycle } from '../../src/entities/Cylce.entity'
import { AppDataSource } from '../../src/config/database/data-source'
import { Request, Response } from 'express'

export const showAll = async (req: Request, res: Response) => {
	const cycles: Cycle[] = await AppDataSource.manager.find<Cycle>(Cycle, {})
	res.json({
		success: true,
		data: cycles,
	})
}
