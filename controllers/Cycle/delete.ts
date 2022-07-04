import { Cycle } from '../../src/entities/Cylce.entity'
import { AppDataSource } from '../../src/config/database/data-source'
import { Request, Response } from 'express'

export const deleteCycle = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		const updateResult = await AppDataSource.manager.delete<Cycle>(Cycle, {
			id,
		})
		res.json({
			success: updateResult.affected === 1,
		})
	} catch (error: any) {
		res.json({
			success: false,
		})
	}
}
