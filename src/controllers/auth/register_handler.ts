import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
import { Traveler } from '../../entities/Traveler.entity'
import { Company } from '../../entities/Company.entity'

const bcrypt = require('bcrypt')
import { Request, Response } from 'express'
import { userValidation } from '../../helpers/validations/user.validation'
import jwt from 'jsonwebtoken'

const register = async (req: Request, res: Response, next: any) => {
	try {

		const existedUser = await AppDataSource.manager.findOneBy<User>(User, {
			email: req.body.email,
		})

		// console.log(existedUser);

		if (!existedUser){
			// const validation = await userValidation.validateAsync(req.body, {
			// 	abortEarly: false,
			// })

			const salt = await bcrypt.genSalt(10)
			const pass = await bcrypt.hash(req.body.password, salt)

			const user = await AppDataSource.manager.insert<User>(User, {
				name: req.body.name,
				email: req.body.email,
				password: pass,
				address: req.body.address,
				// profile_picture: req.body.profile_picture,
				// type: req.body.type,
			})

			const userId = user.generatedMaps[0].id;
			const userType = user.generatedMaps[0].type;

			if(userType == 'traveler'){
				const traveler = await AppDataSource.manager.insert<Traveler>(Traveler, {
					national_id: req.body.national_id,
					gender: req.body.gender,
					date_of_birth: req.body.date_of_birth,
					is_guide: req.body.is_guide,
					user: userId,
				});

			}else{
				const company = await AppDataSource.manager.insert<Company>(Company, {
					description: req.body.description,
					// rate: req.body.rate,
					user: userId,
				});
			}

			// check that both user and traveler inserted or user and company inserted (revert)	

			jwt.sign({ user }, 'secretkey', { expiresIn: '1h' },(err: any, token: any) => {
				return res.status(200).json({
					success: true,
					data: user.generatedMaps,
					// data: user,
					token,
				})
			});
			
	    }else{
			return res.status(404).json({
				success: false,
				error: 'User is exist',
			})
		}
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			// errors: error.details.map((e: Error) => e.message),
			// errors:error,
		})
	}
}

export { register }
