import { Cycle } from '../../entities/Cycle.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { Country } from '../../entities/Country.entity'
import { Program } from '../../entities/Program.entity'
import { cycleValidation } from '../../helpers/validations/cycle.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { ICycleInterface } from '../../helpers/interfaces/ICycle.interface'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";

export const createCycle = async (req: Request, res: Response) => {
	try {
		const validation: ICycleInterface = await cycleValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const program = await AppDataSource.getRepository(Program).findOneBy({
			id: validation.programId,
		})

		if(program?.is_Recurring)
     	{
		const cycle = await AppDataSource.manager.create<Cycle>(Cycle, validation)
		if (program) {
			cycle.program = program
		}

		await cycle.save()

		sendSuccessResponse<Cycle>(res, cycle);
	   }
	   else
	   {
		const error:any=['program not recurring ']
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	   }
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
