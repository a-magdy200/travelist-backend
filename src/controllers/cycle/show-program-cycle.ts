import { Cycle } from "../../entities/Cycle.entity"
import { AppDataSource } from "../../config/database/data-source"
import { Request, Response } from "express"

export const showProgramCycle=async (req: Request, res: Response)=> {
    const programId: number | undefined = +req.params.id;
    const cycle:Cycle[]=await AppDataSource.getRepository(Cycle).find({
      where: {
        program:{id: programId} 
  },
      relations: {
        departure_location: true,
        return_location:true,
        arrival_location:true,
        return_arrival_location:true
      },
    })
    if (cycle) {
      res.json({
        success: true,
        data: cycle
      });
    } else {
      res.status(404).json({sucess:false});
    }
}
