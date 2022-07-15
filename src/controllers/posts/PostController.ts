import { Post } from '../../entities/Post.entity'
import { Traveler } from '../../entities/Traveler.entity'
import { Group } from '../../entities/Group.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { Country } from '../../entities/Country.entity'
import { Program } from '../../entities/Program.entity'
import { postValidation } from '../../helpers/validations/post.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { IPostInterface } from '../../helpers/interfaces/IPost.interface'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'

const createPost = async (req: Request, res: Response) => {
	console.log(req.body)
	try {
		const validation: IPostInterface = await postValidation.validateAsync(
			req.body,
			{
				abortEarly: false,
			}
		)

		const post = await AppDataSource.manager.create<Post>(Post, {
			content: validation.content,
			status: validation.status,
		})
		if (validation.travelerId && validation.groupId) {
			const traveler = await AppDataSource.getRepository(Traveler).findOneBy({
				id: parseInt(validation.travelerId),
			})
			const group = await AppDataSource.getRepository(Group).findOneBy({
				id: parseInt(validation.groupId),
			})

			if (traveler && group) {
				post.traveler = traveler
				post.group = group
			}
		}
		await AppDataSource.manager.save(post)
		sendSuccessResponse<Post>(res, post)
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
export { createPost }
