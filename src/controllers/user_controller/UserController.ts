import { RequestHandler } from 'express'
import { User } from '../../entities/User.entity'
import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { NotFoundResponse } from '../../helpers/responses/404.response'
//import {userValidation} from "../../helpers/validations/user.validation";
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { UPLOAD_DIRECTORY } from '../../helpers/constants/directories'
import { unlinkSync } from 'fs'

// const viewUserProfile: RequestHandler = async (req:Request, res:Response) => {
//   // const user = await AppDataSource.getRepository(User).findOne({
//   //   where: {
//   //     id: parseInt(req.params.id)
//   //   },
//   //   relations: {
//   //     friends: true,
//   //   },
//   // });
//     const user = await AppDataSource.getRepository(User).findOneBy({
//     id: parseInt(req.params.id),
//   });
//   const userFromToken = {
//     id: 1,
//   };
//   let returnvalue;

//   if (user?.id == userFromToken.id) {
//     // view my profile as user
//     returnvalue = {
//       name:"",
//       email:"",
//       address:"",
//       profile_picture:"",

//     };
//   }
//   // view other friend profile
//   else {
//     returnvalue = {
//       name:"",
//       profile_picture:"",
//     };
//   }
//   res.send(returnvalue);
// };
const uploadProfilePicture = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const user: User | null = await AppDataSource.manager.findOneBy<User>(User, {
		id,
	})
	if (user && req.file?.filename) {
		// Remove `uploads/` from path string
		const oldCoverPicture = user.profile_picture
		if (oldCoverPicture && oldCoverPicture !== '') {
			await unlinkSync(`${UPLOAD_DIRECTORY}${oldCoverPicture}`)
		}
		const path = `${req.file.destination}${req.file.filename}`.replace(
			UPLOAD_DIRECTORY,
			''
		)
		user.profile_picture = path
		await user.save()
		res.json({
			success: true,
			path,
		})
	} else {
		res.json(NotFoundResponse)
	}
}
export { uploadProfilePicture }
