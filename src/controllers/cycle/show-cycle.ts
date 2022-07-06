import { Cycle } from '../../entities/Cycle.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'

export const showCycle = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const cycle = await AppDataSource.getRepository(Cycle).findOne({
		where: {
			id: parseInt(req.params.id),
		},
		relations: {
			departure_location: true,
			return_location: true,
			arrival_location: true,
			return_arrival_location: true,
		},
	})
	if (cycle) {
		res.json({
			success: true,
			data: cycle,
		})
	} else {
		res.status(404).json({ sucess: false })
	}
}
