import { Program } from '../../entities/Program.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'

export const update = async (req: Request, res: Response) => {
	/*const program = await AppDataSource.getRepository(Program).findOneBy({
        id: Number(req.params.id),
   })
   if(program)
   {
    AppDataSource.getRepository(Program).merge(program, req.body)
   const results = await AppDataSource.getRepository(Program).save(program)
   return res.send(results)
  }
  else
  {
    return res.send("not found")

  }*/
	try {
		const id: number | undefined = +req.params.id
		const updateProgram = await AppDataSource.manager.update<Program>(
			Program,
			{
				id,
			},
			{}
		)

		res.json({
			success: updateProgram.affected === 1,
		})
	} catch (error: any) {
		res.json({
			success: false,
		})
	}
}
