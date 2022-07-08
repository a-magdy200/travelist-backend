import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/User.entity";
import { Traveler } from "../../entities/Traveler.entity";
import { Company } from "../../entities/Company.entity";
import { Request, Response } from "express";
import { userValidation } from "../../helpers/validations/user.validation";
import jwt from "jsonwebtoken";
import { formatErrorResponse } from "../../helpers/functions/formatErrorResponse";
import { IRegisterRequestBody } from "../../helpers/interfaces/IRegisterRequestBody.interface";
import { travelerValidation } from "../../helpers/validations/traveler.validation";
import { companyValidation } from "../../helpers/validations/company.validation";

const bcrypt = require('bcrypt')

const register = async (req: Request, res: Response, next: any) => {
	try {

		const existedUser = await AppDataSource.manager.findOneBy<User>(User, {
			email: req.body.email,
		})

		const requestBody : IRegisterRequestBody = {...req.body,};
		const userType = req.body.type;
		if (!existedUser){
			const userRequestBody = {
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				address: req.body.address,
				type: req.body.type,
			}
			const travelerRequestBody = {
				gender: req.body.gender,
				date_of_birth: req.body.date_of_birth,
				is_guide: req.body.is_guide === 1,
				national_id: req.body.national_id,
			}
			const companyRequestBody = {
				description: req.body.description,
			}
			const validationUser : User = await userValidation.validateAsync(userRequestBody, {
				abortEarly: false,
			})
			if (userType === 'traveler') {
				const validationTraveler: Traveler = await travelerValidation.validateAsync(travelerRequestBody, {
					abortEarly: false,
				});
			} else {
				const validationCompany: Company = await companyValidation.validateAsync(companyRequestBody, {
					abortEarly: false,
				});
			}

			const salt = await bcrypt.genSalt(10)

			validationUser.password = await bcrypt.hash(req.body.password, salt);
			// how to add hashed password in interface
			const user = await AppDataSource.manager.insert<User>(User,requestBody,
				// {password: pass,}
			)

			const userId = user.generatedMaps[0].id;


			// how to add foreign key in interface
			const userEntity = await AppDataSource.manager.findOneBy<User>(User, {
				id: userId
			});
			if(userType == 'traveler'){
				const traveler = await AppDataSource.manager.insert<Traveler>(Traveler,requestBody);
				const travelerId = traveler.generatedMaps[0].id;
				const travelerEntity = await AppDataSource.manager.findOneBy<Traveler>(Traveler, {
					id: travelerId
				});
				if (travelerEntity && userEntity) {
					travelerEntity.user = userEntity;
					await travelerEntity.save();
				}
			} else {
				const company = await AppDataSource.manager.insert<Company>(Company,requestBody);
				const companyId = company.generatedMaps[0].id;
				const companyEntity = await AppDataSource.manager.findOneBy<Company>(Company, {
					id: companyId
				});
				if (companyEntity && userEntity) {
					companyEntity.user = userEntity;
					await companyEntity.save();
				}
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
