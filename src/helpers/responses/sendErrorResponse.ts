import { Response } from 'express'

export const sendErrorResponse = (
	errors: string[],
	res: Response,
	status: number = 400
) => {
	res.status(status).json({
		success: false,
		errors,
	})
}
