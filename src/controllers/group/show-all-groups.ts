import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { Group } from '../../entities/Group.entity';
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse';
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors';
import { StatusCodes } from '../../helpers/constants/statusCodes';

export const showAllGroups = async (req: Request, res: Response) => {
	try{
	const groups: Group[] = await AppDataSource.manager.find<Group>(
		Group,
		{
			relations: ["posts","country","followers"],
		}
	)
	sendSuccessResponse<Group[]>(res, groups);
	}
	catch (e: any) {
		sendErrorResponse(
			formatValidationErrors(e),
			res,
			StatusCodes.BAD_REQUEST
		)
	}
}
