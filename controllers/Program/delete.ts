import { Program } from "../../src/entities/Program.entity"
import { AppDataSource } from "../../src/config/database/data-source"
import { Request, Response } from "express"
import { DeleteResult } from "typeorm"

export const deleteProgram=async (req: Request, res: Response)=> {
   try {
        const id: number | undefined = +req.params.id;
        const updateResult = await AppDataSource.manager.delete<Program>(Program, {
          id
        });
        res.json({
          success: updateResult.affected === 1,
        });
      } catch (error: any) {
        res.json(error);
      }


}