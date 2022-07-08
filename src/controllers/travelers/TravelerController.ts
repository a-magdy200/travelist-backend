import { RequestHandler } from 'express'
import { Traveler } from '../../entities/Traveler.entity'
import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { NotFoundResponse } from '../../helpers/responses/404.response'
import { travelerValidation } from '../../helpers/validations/traveler.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { UPLOAD_DIRECTORY } from '../../helpers/constants/directories'
import { unlinkSync } from 'fs'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'

const listTravelers = async (req: Request, res: Response) => {
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
	// 	}
	// 	console.log(traveler?.user)
	// 	console.log(traveler?.user?.friends)
	// }
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
		res.json(formatValidationErrors(error))
	}
}

export {
	listTravelers,
	viewTravelerProfile,
	editTravelerProfile
}
