import { Program } from '../../entities/Program.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { sendNotFoundResponse } from "../../helpers/responses/404.response";

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
	const program = await AppDataSource.getRepository(Program).findOne({
		where: {
			id: parseInt(req.params.id),
		},
		relations: ["company", "company.user", "cycles", "reviews", "hotels", "transportation", "country"],
	})
	if (program) {
		sendSuccessResponse<Program>(res, program)
	} else {
		sendNotFoundResponse(res)
	}
}
