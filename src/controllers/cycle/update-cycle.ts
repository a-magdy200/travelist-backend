import { Cycle } from "../../entities/Cycle.entity"
import { AppDataSource } from "../../config/database/data-source"
import { Request, Response } from "express"
import { Country } from "../../entities/Country.entity";
import { cycleValidation } from '../../helpers/validations/cycle.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'

export const updateCycle=async (req: Request, res: Response)=> {
  try {
    const id: number | undefined = parseInt(req.params.id);
    const validation: Cycle = await cycleValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const cycle:Cycle|null = await AppDataSource.getRepository(Cycle).findOne({
			where: {
				id: parseInt(req.params.id),
			},
		})
		if(cycle)
		{
			cycle.name=validation.name
			cycle.max_seats=validation.max_seats
			cycle.departure_date=validation.departure_date
			cycle.arrival_date=validation.arrival_date
			cycle.return_date=validation.return_date
			cycle.return_arrival_date=validation.return_arrival_date
	
		
   const departureCountry = await AppDataSource.getRepository(Country).findOneBy({ id: parseInt(req.body.departureLocationId), })
    const arrivalCountry = await AppDataSource.getRepository(Country).findOneBy({ id: parseInt(req.body.arrivalLocationId), })
    const returnCountry = await AppDataSource.getRepository(Country).findOneBy({ id: parseInt(req.body.returnLocationId), })
    const returnArrivalCountry = await AppDataSource.getRepository(Country).findOneBy({ id: parseInt(req.body.returnArrivalLocationId), })
    if( departureCountry && arrivalCountry && returnCountry&& returnArrivalCountry )
    {
       cycle.departure_location=departureCountry;
       cycle.arrival_location=arrivalCountry;
       cycle.return_location=returnCountry;
       cycle.return_arrival_location=returnArrivalCountry;
       await cycle.save();

    }
		res.json({
			success: true,
			data: cycle,
		})
	}
	} catch (error: any) {
		res.json(formatValidationErrors(error))
		console.log(formatValidationErrors(error))
	}
}
