import { RequestHandler } from 'express'
import { User } from '../../entities/User.entity'
import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { userValidation } from '../../helpers/validations/user.validation'
import { passwordValidation } from '../../helpers/validations/password.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
const viewUserProfile: RequestHandler = async (req, res) => {
	// TODO:: get id from token
	const user = await AppDataSource.getRepository(User).findOneByOrFail(
		{
			id: parseInt(req.params.id),
	})
	sendSuccessResponse<User>(res, user);
}
// const userFromToken = {
// 	id: 3,
// }
// let returnvalue
// view my profile
// user?.find({
// 	where:[
// 		{
// 		//userId_1:userFromToken.id
// 		// userId_2 : parseInt(req.params.id)
// 		},
// 	{
// 		//userId_2:userFromToken.id
// 		// userId_1 : parseInt(req.params.id)
// 	}]
// })

// res.json({
// 	success: true,
// 	data: user,
// })

// view other friend profile
// else {
// 	returnvalue = {
// 		identification: '',
// 		description: '',
// 	}
// }
// 	res.send(returnvalue)

const editUserProfile = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		// TODO:: get id from token
		const validation: User = await userValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const updateResult = await AppDataSource.manager.update<User>(
			User,
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
const updateUserPassword = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		// TODO:: get id from token
		const password_validation: User = await passwordValidation.validateAsync(
			req.body,
			{ abortEarly: false }
		)
		await AppDataSource.manager.update<User>(
			User,

			id,
			{ password: password_validation.password }
		)

		sendSuccessResponse(res)
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}

export { viewUserProfile, editUserProfile, updateUserPassword }
