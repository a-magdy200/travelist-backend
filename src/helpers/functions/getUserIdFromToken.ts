import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import configurations from '../../config/configurations'
import { sendErrorResponse } from "../responses/sendErrorResponse";
import { formatValidationErrors } from "./formatValidationErrors";
import { StatusCodes } from "../constants/statusCodes";
const getUserIdFromToken = (req: Request) => {
	const authorizationHeader = req.headers?.authorization || ''
	const tokenParts = authorizationHeader.split(' ')
	if (tokenParts.length > 1) {
		try {
			const decoded: any = jwt.verify(tokenParts[1], configurations().secret)
			return decoded.user.id
		} catch (e:any) {
			// sendErrorResponse(formatValidationErrors(e), res, StatusCodes.NOT_AUTHORIZED);
			return null;
		}
	} else {
		return null
	}
}
export { getUserIdFromToken }
