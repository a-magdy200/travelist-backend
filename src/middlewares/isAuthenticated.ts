
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const isAuthenticated = async (
	req: Request,
	res: Response,
	next: () => void
) => {
	const bearerHeader = req.headers['authorization']

	if (typeof bearerHeader !== 'undefined') {
		
		const Token = bearerHeader.split(' ')[1];		

		//Decoding the token
		 jwt.verify(Token, 'secretkey', (err: any, requestedUser: any) => {
			if (err) {
				res.status(404).json({
					success:false,
					error: err
				});
			} else {
				req.body = requestedUser;
				next()
			}
		});
	} else {
		res.status(200).json({
			success:false,
			message: "Error!Token was not provided."
		});
	}
}

export { isAuthenticated }
