import { Request, Response } from 'express'
import { AppDataSource } from '../../../config/database/data-source'
import { Hotel } from '../../../entities/Hotel.entity'
import { sendNotFoundResponse } from '../../../helpers/responses/404.response'
import { hotelValidation } from '../../../helpers/validations/hotel.validation'
import { formatValidationErrors } from '../../../helpers/functions/formatValidationErrors'
import { UPLOAD_DIRECTORY } from '../../../helpers/constants/directories'
import { unlinkSync } from 'fs'
import { sendErrorResponse } from '../../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../../helpers/constants/statusCodes'
import { sendSuccessResponse } from "../../../helpers/responses/sendSuccessResponse";
import { IHotelInterface } from "../../../helpers/interfaces/IHotel.interface";

const listHotels = async (req: Request, res: Response) => {
	const hotels: IHotelInterface[] = await AppDataSource.getRepository<Hotel>(Hotel)
		.createQueryBuilder("hotel")
		.innerJoin("hotel.country", "country")
		.leftJoin("hotel.programs", "program")
		.select([
			"hotel.name as name",
			"hotel.id as id",
			"hotel.stars as stars",
			"country.name as countryName",
			"COUNT(program.id) as programsCount"
		])
		.getRawMany();
	sendSuccessResponse<IHotelInterface[]>(res, hotels);
}

const showHotel = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const hotel: Hotel | null = await AppDataSource.manager.findOne<Hotel>(
		Hotel,
		{
			where: {id,},
			relations: ["reviews", "country"]
		}
	)
	if (hotel) {
		sendSuccessResponse<Hotel>(res, hotel);
	} else {
		sendNotFoundResponse(res)
	}
}

const updateHotel = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		const validation: Hotel = await hotelValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		await AppDataSource.manager.update<Hotel>(
			Hotel,
			{
				id,
			},
			validation
		)

		sendSuccessResponse(res);
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
const deleteHotel = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		await AppDataSource.manager.softDelete<Hotel>(Hotel, {
			id,
		})
		sendSuccessResponse(res);
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
const createHotel = async (req: Request, res: Response) => {
	try {
		const validation: Hotel = await hotelValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const hotel = await AppDataSource.manager.create<Hotel>(Hotel, validation)
		await hotel.save()
		sendSuccessResponse<Hotel>(res, hotel);
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
const updateHotelCover = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const hotel: Hotel | null = await AppDataSource.manager.findOneBy<Hotel>(
		Hotel,
		{
			id,
		}
	)
	if (hotel && req.file?.filename) {
		// Remove `uploads/` from path string
		const oldCoverPicture = hotel.cover_picture
		if (oldCoverPicture && oldCoverPicture !== '') {
			await unlinkSync(`${UPLOAD_DIRECTORY}${oldCoverPicture}`)
		}
		const path = `${req.file.destination}${req.file.filename}`.replace(
			UPLOAD_DIRECTORY,
			''
		)
		hotel.cover_picture = path
		await hotel.save()
		sendSuccessResponse(res)
	} else {
		sendNotFoundResponse(res)
	}
}
export {
	createHotel,
	deleteHotel,
	listHotels,
	showHotel,
	updateHotel,
	updateHotelCover,
}
