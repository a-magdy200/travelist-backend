import { Cycle } from '../../entities/Cycle.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { Country } from '../../entities/Country.entity'
import { Program } from '../../entities/Program.entity'
import { cycleValidation } from '../../helpers/validations/cycle.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'

export const createCycle = async (req: Request, res: Response) => {
	console.log(req.body)
	try {
		const validation: Cycle = await cycleValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const cycle = await AppDataSource.manager.create<Cycle>(Cycle, validation)
		const program = await AppDataSource.getRepository(Program).findOneBy({
			id: parseInt(req.body.programId),
		})
		const departureCountry = await AppDataSource.getRepository(
			Country
		).findOneBy({ id: parseInt(req.body.departureLocationId) })
		const arrivalCountry = await AppDataSource.getRepository(Country).findOneBy(
			{ id: parseInt(req.body.arrivalLocationId) }
		)
		const returnCountry = await AppDataSource.getRepository(Country).findOneBy({
			id: parseInt(req.body.returnLocationId),
		})
		const returnArrivalCountry = await AppDataSource.getRepository(
			Country
		).findOneBy({ id: parseInt(req.body.returnArrivalLocationId) })
		if (
			departureCountry &&
			arrivalCountry &&
			returnCountry &&
			returnArrivalCountry &&
			program
		) {
			cycle.program = program
			cycle.departure_location = departureCountry
			cycle.arrival_location = arrivalCountry
			cycle.return_location = returnCountry
			cycle.return_arrival_location = returnArrivalCountry
		}
		await cycle.save()
		res.json({
			success: true,
			data: cycle,
		})
	} catch (error: any) {
		res.json(formatValidationErrors(error))
		console.log(formatValidationErrors(error))
	}
}
