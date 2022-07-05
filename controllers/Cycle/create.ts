import { Cycle } from "../../src/entities/Cycle.entity"
import { AppDataSource } from "../../src/config/database/data-source"
import { Request, Response } from "express"
import { Country } from "../../src/entities/Country.entity";
import { Program } from "../../src/entities/Program.entity";

export const create=async (req: Request, res: Response)=> {
  console.log(req.body);
 try {
    const cycle = await AppDataSource.manager.create<Cycle>(Cycle,{
      name:req.body.name,
      max_seats:parseInt(req.body.max_seats),
      departure_date:req.body.departure_date,
      arrival_date:req.body.arrival_date,
      return_date:req.body.return_date,
      return_arrival_date:req.body.return_arrival_date,
   
    });
    const program = await AppDataSource.getRepository(Program).findOneBy({ id: parseInt(req.body.programId), }) 
    const departureCountry = await AppDataSource.getRepository(Country).findOneBy({ id: parseInt(req.body.departureLocationId), }) 
    const arrivalCountry = await AppDataSource.getRepository(Country).findOneBy({ id: parseInt(req.body.arrivalLocationId), }) 
    const returnCountry = await AppDataSource.getRepository(Country).findOneBy({ id: parseInt(req.body.returnLocationId), }) 
    const returnArrivalCountry = await AppDataSource.getRepository(Country).findOneBy({ id: parseInt(req.body.returnArrivalLocationId), }) 
    if( departureCountry && arrivalCountry && returnCountry&& returnArrivalCountry && program)
    {
       cycle.program=program;
       cycle.departure_location=departureCountry;
       cycle.arrival_location=arrivalCountry;
       cycle.return_location=returnCountry;
       cycle.return_arrival_location=returnArrivalCountry;

    }   
    await cycle.save();
    res.json({
      success: true,
      data: cycle,
    });
  } catch (error: any) {
    res.json(
     {
   success: false,
     
 });
}
}
