import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { Group } from '../../entities/Group.entity'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'

export const showGroup = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	try {
		const group = await AppDataSource.getRepository(Group).findOneOrFail({
			where: {
				id,
			},
			relations: ["posts", "country", "followers", "posts.traveler.user"],
		})
		if (group) {
			sendSuccessResponse<Group>(res, group)
		} else {
			sendNotFoundResponse(res)
		}
	}
	catch (e: any) {
		sendErrorResponse(
			formatValidationErrors(e),
			res,
			StatusCodes.BAD_REQUEST
		)
	}
}
