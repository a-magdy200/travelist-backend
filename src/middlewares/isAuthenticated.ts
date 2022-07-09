
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import configurations from "../config/configurations";

const isAuthenticated = async (
	req: Request,
	res: Response,
	next: () => void
) => {
	const bearerHeader = req.headers['authorization']

	if (typeof bearerHeader !== 'undefined') {

		const Token = bearerHeader.split(' ')[1];

		//Decoding the token
		 jwt.verify(Token, configurations().secret, (err: any, requestedUser: any) => {
			if (err) {
				res.status(401).json({
					success:false,
					error: "not authorized"
				});
			} else {
				req.body.userId = requestedUser.id
				req.body.user_id = requestedUser.id
				next()
			}
		});
	} else {
		res.status(401).json({
			success:false,
			error: "not authorized"
		});
	}
}

export { isAuthenticated }
