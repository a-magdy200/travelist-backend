import { Response } from 'express'
import { StatusCodes } from '../constants/statusCodes'

export const sendNotFoundResponse = (
	res: Response,
	errors: string[] = ['Resource not found']
) => {
	res.status(StatusCodes.NOT_FOUND).json({
		success: false,
		errors,
	})
}
