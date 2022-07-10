import { RequestHandler } from 'express'
import { Traveler } from '../../entities/Traveler.entity'
import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { travelerValidation } from '../../helpers/validations/traveler.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { UPLOAD_DIRECTORY } from '../../helpers/constants/directories'
import { unlinkSync } from 'fs'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'

const listTravelers = async (req: Request, res: Response) => {
	console.log('before find')
	const travelers: Traveler[] = await AppDataSource.manager.find<Traveler>(
		Traveler,
		{}
	)
	res.json({
		success: true,
		data: travelers,
	})
}

const viewTravelerProfile: RequestHandler = async (req, res) => {
	const traveler = await AppDataSource.getRepository(Traveler).findOne({
		where: {
			id: parseInt(req.params.id),
		},
		relations: {
			user: true,
		},
	})

	// const userId = getUserIdFromToken(req, res)
	// view My profile
	// if (traveler) {
	// 	if (traveler?.user?.id== userId) {
	// 		res.json({
	// 			success: true,
	// 			data: [traveler],
	// 		})
	// 		// console.log(traveler?.user)
	// 		// console.log(traveler?.user?.friends)
	// 	}
	// traveler?.user?.friends.find(){wher}
	// // view other profile as friend
	//  else if (userId in

	// 	) {
	//   const entries = await  connection.
	//   traveler?.user.friends.find({
	//    where :[
	//      {user}, {userId_2:userId}
	//  ]
	//  })

	// res.json({
	// 	success: true,
	// 	data: [
	// 		traveler?.is_guide,
	// 		traveler?.profile_picture,
	// 		traveler?.date_of_birth,
	// 	],
	// })
}
// } else {
// 	res
// 		.status(404)
// 		.json({ success: false, message: 'There is no company with this id' })
// }
//}

const editTravelerProfile = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		const validation: Traveler = await travelerValidation.validateAsync(
			req.body,
			{ abortEarly: false }
		)
		const updateResult = await AppDataSource.manager.update<Traveler>(
			Traveler,
			{
				id,
			},
			validation
		)

		res.json({
			success: updateResult.affected === 1,
		})
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
const uploadProfilePicture = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const traveler: Traveler | null =
		await AppDataSource.manager.findOne<Traveler>(Traveler, {
			where: {
				id,
			},
			relations: {
				user: true,
			},
		})
	if (traveler && req.file?.filename) {
		// Remove `uploads/` from path string
		const oldCoverPicture = traveler.user.profile_picture
		if (oldCoverPicture && oldCoverPicture !== '') {
			await unlinkSync(`${UPLOAD_DIRECTORY}${oldCoverPicture}`)
		}
		const path = `${req.file.destination}${req.file.filename}`.replace(
			UPLOAD_DIRECTORY,
			''
		)
		traveler.user.profile_picture = path
		await traveler.user.save()
		res.json({
			success: true,
			path,
		})
	} else {
		sendNotFoundResponse(res)
	}
}
export {
	listTravelers,
	viewTravelerProfile,
	editTravelerProfile,
	uploadProfilePicture,
}
