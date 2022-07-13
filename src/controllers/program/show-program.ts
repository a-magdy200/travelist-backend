import { Program } from '../../entities/Program.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { sendNotFoundResponse } from "../../helpers/responses/404.response";

export const show = async (req: Request, res: Response) => {
	
	const id: number | undefined = +req.params.id
	const program = await AppDataSource.getRepository(Program).findOne({
		where: {
			id: parseInt(req.params.id),
		},
		relations: ["company", "company.user", "cycles",  "hotels", "transportation", "country"],
	})
	if (program) {
		sendSuccessResponse<Program>(res, program)
	} else {
		sendNotFoundResponse(res)
	}
}
