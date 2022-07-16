import { Post } from '../../entities/Post.entity'
import { Traveler } from '../../entities/Traveler.entity'
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
const createPost = async (req: Request, res: Response) => {
	try {
		const userId: number = getUserIdFromToken(req)
		const bodyObj: IPostInterface = await postValidation.validateAsync(
			req.body,
			{
				abortEarly: false,
			}
		)
		const post = await AppDataSource.manager.create<Post>(Post, {
			content: bodyObj.content,
			// status: bodyObj.status,
		})
		const traveler = await AppDataSource.getRepository(Traveler).findOneBy({
			userId: userId,
		})
		if (traveler) {
			post.traveler = traveler
            
		}

		//   const group = await AppDataSource.getRepository(Group).find({
		//     where: {
		//         followers:true
		//     },
		//   })
		//   if (group ) {
		// 	post.group = group
		// }
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
const listPosts = async (req: Request, res: Response) => {
	const hotels: Post[] = await AppDataSource.manager.find<Post>(Post)
	sendSuccessResponse<Post[]>(res, hotels)
}
const showPost = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const post: Post | null = await AppDataSource.manager.findOne<Post>(Post, {
		where: { id },
		relations: ['group', 'traveler'],
	})

	if (post) {
		sendSuccessResponse<Post>(res, post)
	} else {
		sendNotFoundResponse(res)
	}
}
const deletePost = async (req: Request, res: Response) => {
	try {
		const userId: number = getUserIdFromToken(req)
		const id: number | undefined = +req.params.id
		const post: Post | null = await AppDataSource.manager.findOne<Post>(Post, {
			where: { id },
			relations: ['group', 'traveler'],
		})

		if (userId == post?.traveler.userId) {
			await AppDataSource.manager.softDelete<Post>(Post, {
				id,
			})
			sendSuccessResponse(res)
		} else {
			sendErrorResponse(
				['You can not delete this post'],
				res,
				StatusCodes.NOT_AUTHORIZED
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
const editPost = async (req: Request, res: Response) => {
	try {
		const userId: number = getUserIdFromToken(req)
        const id: number | undefined = +req.params.id
        const validation: Post = await postValidation.validateAsync(
			req.body,
			{ abortEarly: false }
		)
		const post: Post | null = await AppDataSource.manager.findOne<Post>(Post, {
			where: { id },
			relations: ['group', 'traveler'],
		})
        console.log('//////////////////// from edit')
        console.log('userId ',userId)
        console.log('traveler ID',post)
        if (userId == post?.traveler.userId) {
		await AppDataSource.manager.update<Post>(Post,{
				id
			},
			validation
		)
		sendSuccessResponse(res)
        }
        else {
			sendErrorResponse(
				['You can not delete this post'],
				res,
				StatusCodes.NOT_AUTHORIZED
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
export { createPost, listPosts, showPost, deletePost ,editPost}
