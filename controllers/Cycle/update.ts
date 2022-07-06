import { Cycle } from "../../src/entities/Cycle.entity"
import { AppDataSource } from "../../src/config/database/data-source"
import { Request, Response } from "express"
import { Country } from "../../src/entities/Country.entity";
import { cycleValidation } from '../../helpers/validations/cycle.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'

export const update=async (req: Request, res: Response)=> {
  try {
    const id: number | undefined = parseInt(req.params.id);
    const validation: Cycle = await cycleValidation.validateAsync(req.body, {
			abortEarly: false,
		})
   const updateCycle = await AppDataSource.manager.update<Cycle>(Cycle, {
     id
   }, validation);
   const cycle=await AppDataSource.getRepository(Cycle).findOne({
    where: {
      id: parseInt(req.params.id),
    },
    })
    
    
   /*  const cycle: Cycle | null = await AppDataSource.manager.findOneBy<Cycle>(Cycle, {
      id
    });
   const departureCountry = await AppDataSource.getRepository(Country).findOneBy({ id: parseInt(req.body.departureLocationId), }) 
    const arrivalCountry = await AppDataSource.getRepository(Country).findOneBy({ id: parseInt(req.body.arrivalLocationId), }) 
    const returnCountry = await AppDataSource.getRepository(Country).findOneBy({ id: parseInt(req.body.returnLocationId), }) 
    const returnArrivalCountry = await AppDataSource.getRepository(Country).findOneBy({ id: parseInt(req.body.returnArrivalLocationId), }) 
    if( cycle&&departureCountry && arrivalCountry && returnCountry&& returnArrivalCountry )
    {
       cycle.departure_location=departureCountry;
       cycle.arrival_location=arrivalCountry;
       cycle.return_location=returnCountry;
       cycle.return_arrival_location=returnArrivalCountry;
       await cycle.save();

    }   
*/
    res.json({
      success: updateCycle.affected === 1,
      data:updateCycle
    });
  } catch (error: any) {
    //res.json({
     // success:false
    //});
    res.json(formatValidationErrors(error));
    console.log(formatValidationErrors(error))
    }
}