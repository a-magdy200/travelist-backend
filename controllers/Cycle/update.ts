import { Cycle } from "../../src/entities/Cycle.entity"
import { AppDataSource } from "../../src/config/database/data-source"
import { Request, Response } from "express"
import { Country } from "../../src/entities/Country.entity";

export const update=async (req: Request, res: Response)=> {
  try {
    const id: number | undefined = parseInt(req.params.id);

    const updateCycle = await AppDataSource.manager.update<Cycle>(Cycle, {
      id
    }, {});
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
    console.log(error)
  }
}