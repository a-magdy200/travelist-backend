import { AppDataSource } from '../../config/database/data-source'
import { User } from '../../entities/User.entity'
import { Traveler } from '../../entities/Traveler.entity'
import { Company } from '../../entities/Company.entity'
import { Request, Response } from 'express'
import { userValidation } from '../../helpers/validations/user.validation'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { IRegisterRequestBody } from '../../helpers/interfaces/IRegisterRequestBody.interface'
import { travelerValidation } from '../../helpers/validations/traveler.validation'
import { companyValidation } from '../../helpers/validations/company.validation'
import { sendAuthenticationResponse } from '../../helpers/responses/sendAuthenticationResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import bcrypt from 'bcrypt'
import { ITravelerRequestBodyInterface } from '../../helpers/interfaces/ITravelerRequestBody.interface'
import { ICompanyRequestBodyInterface } from '../../helpers/interfaces/ICompanyRequestBody.interface'
import { IUserRequestBodyInterface } from '../../helpers/interfaces/IUserRequestBody.interface'

export const register = async (req: Request, res: Response, next: any) => {
	try {
		const existedUser = await AppDataSource.manager.findOneBy<User>(User, {
			email: req.body.email,
		})
		if (!existedUser) {
			const requestBody: IRegisterRequestBody = { ...req.body }
			const userType = requestBody.type


			const userRequestBody: IUserRequestBodyInterface = {
				name: requestBody.name,
				email: requestBody.email,
				password: requestBody.password,
				address: requestBody.address,
				type: requestBody.type,
			}
			const travelerRequestBody: ITravelerRequestBodyInterface = {
				gender: requestBody.gender,
				date_of_birth: requestBody.date_of_birth,
				is_guide: req.body.is_guide,
				national_id: requestBody.national_id,
			}
			const companyRequestBody: ICompanyRequestBodyInterface = {
				description: requestBody.description,
			}
			const validationUser: User = await userValidation.validateAsync(
				userRequestBody,
				{
					abortEarly: false,
				}
			)

			let roleValidatedBody:
				| ITravelerRequestBodyInterface
				| ICompanyRequestBodyInterface
			if (userType === 'traveler') {
				roleValidatedBody = await travelerValidation.validateAsync(
					travelerRequestBody,
					{
						abortEarly: false,
					}
				)
			} else {
				roleValidatedBody = await companyValidation.validateAsync(
					companyRequestBody,
					{
						abortEarly: false,
					}
				)
			}
			const salt = await bcrypt.genSalt(10)

			validationUser.password = await bcrypt.hash(req.body.password, salt)
			const user = await AppDataSource.manager.insert<User>(
				User,
				validationUser
			)
			const userId = user.generatedMaps[0].id
			const userEntity = await AppDataSource.manager.findOneBy<User>(User, {
				id: userId,
			})
			if (userType === 'traveler') {
				const traveler = await AppDataSource.manager.insert<Traveler>(
					Traveler,
					// todo:: roleValidatedBody as ITravelerRequestBodyInterface,
					{
						gender: requestBody.gender,
						date_of_birth: requestBody.date_of_birth,
						is_guide: req.body.is_guide === "1",
						national_id: requestBody.national_id,
						userId: userEntity?.id,
					}
				)

				const travelerId = traveler.generatedMaps[0].id
				const travelerEntity = await AppDataSource.manager.findOneBy<Traveler>(
					Traveler,
					{
						id: travelerId,
					}
				)
				if (travelerEntity && userEntity) {
					travelerEntity.user = userEntity
					await travelerEntity.save()
				}
			} else {
				const company = await AppDataSource.manager.insert<Company>(
					Company,
					// todo:: roleValidatedBody as ICompanyRequestBodyInterface
					{
						description: requestBody.description,
						userId: userEntity?.id,
					}
				)
				const companyId = company.generatedMaps[0].id
				const companyEntity = await AppDataSource.manager.findOneBy<Company>(
					Company,
					{
						id: companyId,
					}
				)
				if (companyEntity && userEntity) {
					companyEntity.user = userEntity
					await companyEntity.save()
				}
			}
			if (userEntity) {
				sendAuthenticationResponse(userEntity, res)
			}
		}
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
