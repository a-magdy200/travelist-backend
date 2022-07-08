import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import configurations from "../../config/configurations";
const getUserIdFromToken = (req: Request, res: Response) => {
	 const authorizationHeader = req.headers?.authorization || '';
	 const tokenParts = authorizationHeader.split(" ");
	if (tokenParts.length > 1){
		const decoded :any = jwt.verify(tokenParts[1], configurations().secret);
		return decoded.user.id
	} else {
		return null
	}
}
export{getUserIdFromToken}
