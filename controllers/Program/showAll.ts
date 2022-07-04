import { Program } from "../../src/entities/Program.entity"
import { AppDataSource } from "../../src/config/database/data-source"
import { Request, Response } from "express"

export const showAll=async (req: Request, res: Response)=> {
   /* const programs = await AppDataSource.getRepository(Program).find()
    console.log(programs)
    if(programs.length==0)
    res.send("empty programs")
    else
    res.json(programs)
*/
const programs: Program[] = await AppDataSource.manager.find<Program>(Program ,{});
  res.json({
    success: true,
    data: programs
  });



}