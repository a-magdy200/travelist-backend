import { Cycle } from "../../src/entities/Cylce.entity"
import { AppDataSource } from "../../src/config/database/data-source"
import { Request, Response } from "express"

export const update=async (req: Request, res: Response)=> {
  try {
    const id: number | undefined = +req.params.id;
    const updateCycle = await AppDataSource.manager.update<Cycle>(Cycle, {
      id
    }, {});

    res.json({
      success: updateCycle.affected === 1,
    });
  } catch (error: any) {
    res.json({
      success:false
    });
  }
}