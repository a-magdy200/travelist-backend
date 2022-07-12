import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { Group } from '../../entities/Group.entity';

export const showAllGroups = async (req: Request, res: Response) => {
	const groups: Group[] = await AppDataSource.manager.find<Group>(
		Group,
		{
			relations: ["posts","country","followers"],
		}
	)
	sendSuccessResponse<Group[]>(res, groups);
}
