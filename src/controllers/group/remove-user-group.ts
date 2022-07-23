import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { Group } from '../../entities/Group.entity'
import { User } from '../../entities/User.entity'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'

export const removeUserGroup = async (req: Request, res: Response) => {
	try {
		const groupId: number | undefined = +req.params.groupId
		const userId: number = getUserIdFromToken(req)
		const group = await AppDataSource.getRepository(Group).findOne({
			where: {
				id: groupId,
			},
			relations: ['followers'],
		})
		const user = await AppDataSource.getRepository(User).findOne({
			where: {
				id: userId,
			},
			relations: ['groups'],
		})

		let flag: boolean = false
		if (user) {
			user.groups.forEach(function (item) {
				if (item.id == groupId) {
					flag = true
					return
				}
			})
		}

		if (group && user && flag) {
			group.followers_count -= 1

			group.followers = group.followers.filter((follower) => {
				return follower.id !== userId
			})

			await AppDataSource.manager.save(group)

			sendSuccessResponse<Group>(res, group)
		} else {
			const error: any = ['not found']
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
