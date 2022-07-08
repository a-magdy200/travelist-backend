import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
import { Traveler } from '../../entities/Traveler.entity'
import { Company } from '../../entities/Company.entity'

const bcrypt = require('bcrypt')
import { Request, Response } from 'express'
import { userValidation } from '../../helpers/validations/user.validation'
import jwt from 'jsonwebtoken'
import { formatErrorResponse } from '../../helpers/functions/formatErrorResponse'
import { IRegisterRequestBody } from '../../helpers/interfaces/IRegisterRequestBody.interface'
import { travelerValidation } from '../../helpers/validations/traveler.validation'
import { companyValidation } from '../../helpers/validations/company.validation'

const register = async (req: Request, res: Response, next: any) => {
	try {

		const existedUser = await AppDataSource.manager.findOneBy<User>(User, {
			email: req.body.email,
		})

		const requestBody : IRegisterRequestBody = {...req.body,};

		if (!existedUser){
			const validationUser : User = await userValidation.validateAsync(requestBody, {
				abortEarly: false,
			})
			const validationTraveler : Traveler = await travelerValidation.validateAsync(req.body, {
				abortEarly: false,
			})
			const validationCompany : Company = await companyValidation.validateAsync(req.body, {
				abortEarly: false,
			})

			const salt = await bcrypt.genSalt(10)
			const pass = await bcrypt.hash(req.body.password, salt)

			// how to add hashed password in interface
			const user = await AppDataSource.manager.insert<User>(User,requestBody, 		
				// {password: pass,}
			)

			const userId = user.generatedMaps[0].id;
			const userType = req.body.type;

			// how to add foreign key in interface
			if(userType == 'traveler'){
				const traveler = await AppDataSource.manager.insert<Traveler>(Traveler,requestBody, 
					// {user: userId,} 
				);
			}else{
				const company = await AppDataSource.manager.insert<Company>(Company,requestBody, 
					// {user: userId,} 
				);
			}

			// check that both user and traveler inserted or user and company inserted (revert)	

			jwt.sign({ user }, 'secretkey', { expiresIn: '1h' },(err: any, token: any) => {
				return res.status(200).json({
					success: true,
					data: user.generatedMaps,
					token,
				})
			});
			
	    }else{
			return res.status(404).json(formatErrorResponse(["User is exist"]));	
		}
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			// errors: error.details.map((e: Error) => e.message),
			errors:error.details,
		})
	}
}

export { register }
