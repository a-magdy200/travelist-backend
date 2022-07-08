import { AppDataSource } from "../../config/database/data-source"
import { Request, Response } from "express"
import { Cycle } from "../../entities/Cycle.entity";

export const deleteCycle=async (req: Request, res: Response)=> {
    try {
        const id: number | undefined = +req.params.id;
const updateResult = await AppDataSource.manager.delete<Cycle>(Cycle, {
          id
        });
        res.json({
          success: updateResult.affected === 1,
        });
      } catch (error: any) {
        res.json(
            {
            success: false,

          });
      }

}
