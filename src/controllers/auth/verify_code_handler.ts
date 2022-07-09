import { AppDataSource } from '../../config/database/data-source'
import { ForgetPasswordCode } from '../../entities/ForgetPasswordCode.entity'
import { Request, Response } from 'express'
import { formatErrorResponse } from '../../helpers/functions/formatErrorResponse'

const verifyCode = async (req: Request, res: Response, next: any) => {
	if (req.body.email !== undefined && req.body.code !== undefined) {
		const user_pass_forget =
			await AppDataSource.manager.findOneBy<ForgetPasswordCode>(
				ForgetPasswordCode,
				{
					email: req.body.email,
				}
			)

		if (user_pass_forget !== null) {
			if (req.body.code == user_pass_forget.code) {
				return res.status(200).json({
					success: true,
				})
			} else {
				return res.status(404).json(formatErrorResponse(['Incorrect code']))
			}
		} else {
			return res
				.status(404)
				.json(formatErrorResponse(['Invalid email, user not found']))
		}
	} else {
		return res.status(404).json(formatErrorResponse(['Missing email or code']))
	}
}

export { verifyCode }
