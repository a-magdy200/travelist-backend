import { Program } from '../../src/entities/Program.entity'
import { AppDataSource } from '../../src/config/database/data-source'
import { Request, Response } from 'express'

export const show = async (req: Request, res: Response) => {
	/* const program = await AppDataSource.getRepository(Program).findOneBy({
        id: Number(req.params.id)
    })
   if(program)
    return res.send(program)
   else
   return res.status(404).send('Not found');
   */
	const id: number | undefined = +req.params.id
	const program: Program | null =
		await AppDataSource.manager.findOneBy<Program>(Program, {
			id,
		})
	if (program) {
		res.json({
			success: true,
			data: program,
		})
	} else {
		res.status(404).json({ sucess: false })
	}
}
