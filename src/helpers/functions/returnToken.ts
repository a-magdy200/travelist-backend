import { Request, Response } from 'express'
import jwt_decode from "jwt-decode";
 const returnToken = (req: Request, res: Response) => {
	const bearerHeader = req.headers['authorization']

	if (typeof bearerHeader !== 'undefined') {
		const Token = bearerHeader.split(' ')[1]
		//  console.log(Token)
		return Token
	} else {
		res.status(200).json({
			success: false,
			message: 'Error! you do not have authorization.',
		})
	}
}
 const returnId = (req: Request, res: Response) => {
	const Token = returnToken(req,res)
	if (Token !==undefined){
		var decoded :any = jwt_decode(Token);
	}
	if(decoded){
		var userId = decoded.user.id
		return userId
	}
	else{
		return null
	}
	
 }
 export{returnToken,returnId}