import { Cycle } from "../../src/entities/Cylce.entity"
import { AppDataSource } from "../../src/config/database/data-source"
import { Request, Response } from "express"

export const create=async (req: Request, res: Response)=> {
  try {
    const cycle = await AppDataSource.manager.create<Cycle>(Cycle, {});
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
