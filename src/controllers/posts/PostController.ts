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
import notify from '../../helpers/common/notify'
import { NotificationEnum } from '../../helpers/enums/notification.enum'
const createPost = async (req: Request, res: Response) => {
	try {
		const userId: number = getUserIdFromToken(req)
		const groupId: number | undefined = +req.body.groupId
		const bodyObj: IPostInterface = await postValidation.validateAsync(
			req.body,
			{
				abortEarly: false,
			}
		)
		const traveler = await AppDataSource.getRepository(Traveler).findOneOrFail({
			where: {
				userId: userId,
			},
			relations: ['user'],
		})
		// if userId in group.followers =>can create
		// const group = await AppDataSource.getRepository(Group).findOneOrFail({
		// 	where: {
		// 		id: groupId,
		// 	},
		// 	relations: ['followers'],
		// })
		// const followers = group?.followers
		// const existedUser = followers?.find((obj) => {
		// 	return obj.id === userId
		// })
		// if (existedUser) {
		// 	console.log('existedUser', existedUser)

		const post = await AppDataSource.manager.create<Post>(Post, {
			content: bodyObj.content,
			travelerId: traveler?.id,
			groupId,
		})
		await AppDataSource.manager.save(post)
		sendSuccessResponse<Post>(res, post)

		const group = await AppDataSource.manager.findOneOrFail(Group, {
			where: {
				id: groupId,
			},
			relations: ['followers'],
		})
		
		group.followers.forEach((user) => {
			if (user.id && user.id !== userId) {
				notify({
					type: NotificationEnum.POST_CREATED,
					userId: user.id,
					content: `New post has been added to a group you are following`,
					title: 'Post added',
				})
			}
		})
		// } else {
		// 	sendErrorResponse(
		// 		['You can not create post here'],
		// 		res,
		// 		StatusCodes.NOT_AUTHORIZED
		// 	)
		// }
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
const listAllPosts = async (req: Request, res: Response) => {
	try {
		const posts: Post[] = await AppDataSource.manager.find<Post>(Post, {
			where: { status: Not('reported') },
			relations: ['traveler', 'traveler.user'],
			order: {
				id: 'DESC',
			},
		})
		sendSuccessResponse<Post[]>(res, posts)
	} catch (e: any) {
		sendErrorResponse(formatValidationErrors(e), res, StatusCodes.BAD_REQUEST)
	}
}

const listMyPosts = async (req: Request, res: Response) => {
	const userId: number = getUserIdFromToken(req)
	try {
		const posts: Post[] = await AppDataSource.manager.find<Post>(Post, {
			relations: ['traveler', 'traveler.user'],
			where: {
				traveler: {
					userId: userId,
				},
			},
			order: {
				id: 'DESC',
			},
		})

		sendSuccessResponse<Post[]>(res, posts)
	} catch (e: any) {
		sendErrorResponse(formatValidationErrors(e), res, StatusCodes.BAD_REQUEST)
	}
}
const showPost = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	try {
		const post: Post | null = await AppDataSource.manager.findOneOrFail<Post>(
			Post,
			{
				where: { id },
				relations: ['group', 'traveler.user'],
			}
		)

		if (post) {
			sendSuccessResponse<Post>(res, post)
		} else {
			sendNotFoundResponse(res)
		}
	} catch (e: any) {
		sendErrorResponse(formatValidationErrors(e), res, StatusCodes.BAD_REQUEST)
	}
}
const deletePost = async (req: Request, res: Response) => {
	try {
		const userId: number = getUserIdFromToken(req)
		const id: number | undefined = +req.params.id
		const post: Post | null = await AppDataSource.manager.findOneOrFail<Post>(
			Post,
			{
				where: { id },
				relations: ['group', 'traveler.user'],
			}
		)

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
		const validation: Post = await postValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const post: Post | null = await AppDataSource.manager.findOneOrFail<Post>(
			Post,
			{
				where: { id },
				relations: ['group', 'traveler.user'],
			}
		)
		if (userId == post?.traveler.userId) {
			await AppDataSource.manager.update<Post>(
				Post,
				{
					id,
				},
				validation
			)
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

// const reportPost = async (req: Request, res: Response) => {
// 	try {
// 		const userId: number = getUserIdFromToken(req)
// 		const id: number | undefined = +req.params.id
// 		const validation: Post = await postStatusValidation.validateAsync(req.body, {
// 			abortEarly: false,
// 		})
// 		const post: Post | null = await AppDataSource.manager.findOneOrFail<Post>(Post, {
// 			where: { id },
// 			relations: ['group', 'traveler.user'],
// 		})
// 			await AppDataSource.manager.update<Post>(
// 				Post,
// 				{
// 					id,
// 				},
// 				validation
// 			)
// 			sendSuccessResponse(res)
// 	} catch (error: any) {
// 		sendErrorResponse(
// 			formatValidationErrors(error),
// 			res,
// 			StatusCodes.NOT_ACCEPTABLE
// 		)
// 	}
// }
export { createPost, listAllPosts, listMyPosts, showPost, deletePost, editPost }
