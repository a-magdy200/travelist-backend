import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { Hotel } from '../../entities/Hotel.entity'
import { NotFoundResponse } from '../../helpers/responses/404.response'
import { hotelValidation } from '../../helpers/validations/hotel.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { UPLOAD_DIRECTORY } from '../../helpers/constants/directories'
import { unlinkSync } from 'fs'

const listHotels = async (req: Request, res: Response) => {
	const hotels: Hotel[] = await AppDataSource.manager.find<Hotel>(Hotel, {
		// withDeleted: true, // to return soft deleted records
	})
	res.json({
		success: true,
		data: hotels,
	})
}

const showHotel = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const hotel: Hotel | null = await AppDataSource.manager.findOneBy<Hotel>(
		Hotel,
		{
			id,
		}
	)
	if (hotel) {
		res.json({
			success: true,
			data: hotel,
		})
	} else {
		res.status(404).json(NotFoundResponse)
	}
}

const updateHotel = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		const validation: Hotel = await hotelValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const updateResult = await AppDataSource.manager.update<Hotel>(
			Hotel,
			{
				id,
			},
			validation
		)

		res.json({
			success: updateResult.affected === 1,
		})
	} catch (error: any) {
		res.json(formatValidationErrors(error))
	}
}
const deleteHotel = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		const updateResult = await AppDataSource.manager.softDelete<Hotel>(Hotel, {
			id,
		})
		res.json({
			success: updateResult.affected === 1,
		})
	} catch (error: any) {
		res.json(formatValidationErrors(error))
	}
}
const createHotel = async (req: Request, res: Response) => {
	try {
		const validation: Hotel = await hotelValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const hotel = await AppDataSource.manager.create<Hotel>(Hotel, validation)
		await hotel.save()
		res.json({
			success: true,
			data: hotel,
		})
	} catch (error: any) {
		res.json(formatValidationErrors(error))
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
		res.json({
			success: true,
			path,
		})
	} else {
		res.json(NotFoundResponse)
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
