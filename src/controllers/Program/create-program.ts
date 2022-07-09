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
/*interface ProgramCreateBody {
  name: string;
  description: string;
  price: string;
  is_Recurring: boolean;
  companyId: string;
  hotels: string | string[];
}*/

export const create = async (req: Request, res: Response) => {
	console.log(req.body)
	try {
		const validation: Program = await programValidation.validateAsync(
			req.body,
			{
				abortEarly: false,
			}
		)
		const bodyObject: IProgramInterface = {
			...req.body,
			is_Recurring: req.body.is_Recurring === '1',
		}
		const path = `${req.file?.destination}${req.file?.filename}`.replace(
			UPLOAD_DIRECTORY,
			''
		)

		const program = await AppDataSource.manager.create<Program>(Program, {
			name: bodyObject.name,
			description: bodyObject.description,
			cover_picture: path,
			price: parseInt(bodyObject.price),
			is_Recurring: req.body.is_Recurring,
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
		res.json({
			success: true,
			data: program,
		})
	} catch (error: any) {
		res.json(formatValidationErrors(error))
		console.log(formatValidationErrors(error))
	}
}
