import { User } from '../../entities/User.entity'
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import configurations from '../../config/configurations'

export const sendAuthenticationResponse = (user: User, res: Response) => {
	const signedData = {
		id: user.id,
		type: user.type,
	}
	const userData = {
		id: user.id,
		name: user.name,
		type: user.type,
		profile_picture: user.profile_picture,
	}
	jwt.sign(
		{ user: signedData },
		configurations().secret,
		{ expiresIn: '1h' },
		(err: any, token: any) => {
			res.status(200).json({
				success: true,
				data: {
					access_token: token,
					user: userData,
				},
			})
		}
	)
}
