import { AppDataSource } from '../../config/database/data-source'
import { ForgetPasswordCode } from '../../entities/ForgetPasswordCode.entity'
import { Request, Response } from 'express'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { IVerifyCodeRequestInterface } from '../../helpers/interfaces/IVerifyCodeRequest.interface'
import { verifyCodeValidation } from '../../helpers/validations/verifyCode.validation'

export const verifyCode = async (req: Request, res: Response, next: any) => {
	try {
		const validated: IVerifyCodeRequestInterface =
			await verifyCodeValidation.validateAsync(req.body)
		const user_password_forget =
			await AppDataSource.manager.findOneBy<ForgetPasswordCode>(
				ForgetPasswordCode,
				{
					email: validated.email,
				}
			)

		if (user_password_forget) {
			if (validated.code == user_password_forget.code) {
				sendSuccessResponse<IVerifyCodeRequestInterface>(res, validated)
			} else {
				sendErrorResponse(['Incorrect code'], res, StatusCodes.NOT_ACCEPTABLE)
			}
		} else {
			sendErrorResponse(
				['Invalid email, user not found'],
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	} catch (e: any) {
		sendErrorResponse(
			formatValidationErrors(e),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
