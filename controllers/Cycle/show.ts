import { Cycle } from "../../src/entities/Cylce.entity"
import { AppDataSource } from "../../src/config/database/data-source"
import { Request, Response } from "express"

export const show=async (req: Request, res: Response)=> {
    const id: number | undefined = +req.params.id;
    const cycle: Cycle | null = await AppDataSource.manager.findOneBy<Cycle>(Cycle, {
      id
    });
    if (cycle) {
      res.json({
        success: true,
        data: cycle
      });
    } else {
      res.status(404).json({sucess:false});
    }
}