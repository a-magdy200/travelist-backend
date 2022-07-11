import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { Group } from '../../entities/Group.entity'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'

export const showGroup = async (req: Request, res: Response) => {
    const id: number | undefined = +req.params.id
	const group = await AppDataSource.getRepository(Group).findOne({
		where: {
			id: parseInt(req.params.id),
		},
		relations: ["posts", "country","followers"],
	})
	if (group) {
		sendSuccessResponse<Group>(res, group)
	} else {
		sendNotFoundResponse(res)
	}
}