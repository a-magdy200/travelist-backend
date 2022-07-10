import { Program } from '../../entities/Program.entity'
import { Company } from '../../entities/Company.entity'
import { Hotel } from '../../entities/Hotel.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { In } from 'typeorm'
import { Transportation } from '../../entities/Transportation.entity'
import { UPLOAD_DIRECTORY } from '../../helpers/constants/directories'
import { programValidation } from '../../helpers/validations/program.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { IProgramInterface } from '../../helpers/interfaces/IProgram.interface'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";

export const create = async (req: Request, res: Response) => {
	console.log(req.body)
	try {
		const bodyObject: IProgramInterface = await programValidation.validateAsync(
			req.body,
			{
				abortEarly: false,
			}
		)
		const path = `${req.file?.destination}${req.file?.filename}`.replace(
			UPLOAD_DIRECTORY,
			''
		)

		const program = await AppDataSource.manager.create<Program>(Program, {
			name: bodyObject.name,
			description: bodyObject.description,
			cover_picture: path,
			price: parseInt(bodyObject.price),
			is_Recurring: bodyObject.is_Recurring,
		})

		const hotelsIds =
			typeof bodyObject.hotels === 'string'
				? [parseInt(bodyObject.hotels, 10)]
				: bodyObject.hotels?.map((hotelId: string) => parseInt(hotelId, 10))
		if (hotelsIds && bodyObject.companyId) {
			const loadedHotels = await AppDataSource.manager.findBy(Hotel, {
				id: In(hotelsIds),
			})
			const company = await AppDataSource.getRepository(Company).findOneBy({
				id: parseInt(bodyObject.companyId),
			})
			program.hotels = loadedHotels

			const transportation = await AppDataSource.getRepository(
				Transportation
			).findOneBy({ id: 1 })

			if (company && transportation) {
				program.company = company
				program.transportation = transportation
			}
		}
		await AppDataSource.manager.save(program)
		sendSuccessResponse<Program>(res, program)
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
