import { Program } from "../../entities/Program.entity"
import { AppDataSource } from "../../config/database/data-source"
import { Request, Response } from "express"

export const show=async (req: Request, res: Response)=> {
   /* const program = await AppDataSource.getRepository(Program).findOneBy({
        id: Number(req.params.id)
    })
   if(program)
    return res.send(program)
   else
   return res.status(404).send('Not found');
   */
   const id: number | undefined = +req.params.id;
   const program=await AppDataSource.getRepository(Program).findOne({
    where: {
      id: parseInt(req.params.id),
    },
    relations: {
      company: true,
      transportation:true,
      hotels:true,
       },
  })
   if (program) {
     res.json({
       success: true,
       data: program
     });
   } else {
     res.status(404).json({sucess:false});
   }
}
