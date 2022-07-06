import { Cycle } from "../../entities/Cycle.entity"
import { AppDataSource } from "../../config/database/data-source"
import { Request, Response } from "express"

export const showAllCycles=async (req: Request, res: Response)=> {
  const cycles: Cycle[] = await AppDataSource.manager.find<Cycle>(Cycle ,{ relations: {
    return_arrival_location: true,
    arrival_location: true,
    departure_location: true,
    return_location: true,


  }});
    res.json({
      success: true,
      data: cycles
    });




}
