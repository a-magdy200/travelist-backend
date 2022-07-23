import { Post } from '../../entities/Post.entity'
import { User } from '../../entities/User.entity'
import { Traveler } from '../../entities/Traveler.entity'
import { Not } from 'typeorm'
import { Group } from '../../entities/Group.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { postValidation } from '../../helpers/validations/post.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { IPostInterface } from '../../helpers/interfaces/IPost.interface'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { postReportValidation } from '../../helpers/validations/post_report.validation'
import { NOT_CONTAINS } from 'class-validator'
import { IPostReportInterface } from '../../helpers/interfaces/IPostReport.interface'
import { PostReport } from '../../entities/PostReport.entity'
import { postStatusValidation } from '../../helpers/validations/post_status.validation'
const createPostReport = async (req: Request, res: Response) => {
	try {
		const userId: number = getUserIdFromToken(req)
		const postId: number | undefined = +req.body.postId
		const bodyObj: IPostReportInterface =
			await postReportValidation.validateAsync(req.body, {
				abortEarly: false,
			})
		const user = await AppDataSource.getRepository(User).findOneByOrFail({
			id: userId,
		})
		const post = await AppDataSource.getRepository(Post).findOneByOrFail({
			id: postId,
		})
		//////////////////
		const postReport = await AppDataSource.manager.create<PostReport>(
			PostReport,
			{
				reason: bodyObj.reason,
			}
		)
		if (user) {
			postReport.user = user
			await AppDataSource.manager.save(postReport)
		}
		if (post) {
			postReport.post = post
			await AppDataSource.manager.save(postReport)
		}
		if (post?.status) {
			await AppDataSource.manager.update<Post>(
				Post,
				{
					id: postId,
				},
				{
					status: 'reported',
				}
			)
			await AppDataSource.manager.save(postReport)
			postReport.post.status = post.status
		}
	
		await AppDataSource.manager.save(postReport)
		sendSuccessResponse<PostReport>(res, postReport)
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}

export { createPostReport }
