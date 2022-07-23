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
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { Country } from '../../entities/Country.entity'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import notify from '../../helpers/common/notify'
import { NotificationEnum } from '../../helpers/enums/notification.enum'
import { Traveler } from '../../entities/Traveler.entity'

export const create = async (req: Request, res: Response) => {
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
		await program.save()

		const hotelsIds =
			typeof bodyObject.hotels === 'string'
				? [parseInt(bodyObject.hotels, 10)]
				: bodyObject.hotels?.map((hotelId: string) => parseInt(hotelId, 10))

		const destinationIds =
			typeof bodyObject.destinations === 'string'
				? [parseInt(bodyObject.destinations, 10)]
				: bodyObject.destinations?.map((destinationId: string) =>
						parseInt(destinationId, 10)
				  )

		if (
			hotelsIds &&
			destinationIds &&
			bodyObject.countryId &&
			bodyObject.transportationId
		) {
			const loadedHotels = await AppDataSource.manager.findBy(Hotel, {
				id: In(hotelsIds),
			})

			const loadedDestinations = await AppDataSource.manager.findBy(Country, {
				id: In(destinationIds),
			})

			program.hotels = loadedHotels
			program.destinations = loadedDestinations

			const userId: number = getUserIdFromToken(req)
			const company = await AppDataSource.getRepository(
				Company
			).findOneByOrFail({
				user: { id: userId },
			})
			const country = await AppDataSource.getRepository(
				Country
			).findOneByOrFail({
				id: parseInt(bodyObject.countryId),
			})

			const transportation = await AppDataSource.getRepository(
				Transportation
			).findOneByOrFail({ id: parseInt(bodyObject.transportationId) })

			if (company && transportation && country) {
				program.company = company
				program.country = country
				program.transportation = transportation
			}
		}
		await AppDataSource.manager.save(program)
		sendSuccessResponse<Program>(res, program)

		const travelers: Traveler[] = await AppDataSource.manager.find<Traveler>(
			Traveler,
			{}
		)
		if (travelers) {
			travelers.forEach((traveler) => {
				notify({
					type: NotificationEnum.COMPANY_CREATED_PROGRAM,
					userId: traveler.userId,
					content: `New program has been added`,
					title: 'Program Added',
				})
			})
		}
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
