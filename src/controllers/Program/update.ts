import { Program } from '../../entities/Program.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { UPLOAD_DIRECTORY } from '../../helpers/constants/directories'
import { programUpdateValidation } from '../../helpers/validations/program-update.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { Hotel } from '../../entities/Hotel.entity'
import { In } from 'typeorm'
import { unlinkSync } from 'fs'


interface ProgramUpdateBody {
	name:string
	description: string
	price: string
	hotels: string | string[]
}

export const update = async (req: Request, res: Response) => {
	
	try {
		const id: number | undefined = +req.params.id
		const validation: Program = await programUpdateValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const bodyObject: ProgramUpdateBody = { ...req.body }
		const program:Program|null = await AppDataSource.getRepository(Program).findOne({
			where: {
				id: parseInt(req.params.id),
			},
		})
		if(program &&validation && req.file?.filename)
		{
			program.name=validation.name
			program.description= validation.description
			program.price= validation.price
			const hotelsIds =typeof bodyObject.hotels === 'string'
			? [parseInt(bodyObject.hotels, 10)]
			: bodyObject.hotels?.map((hotelId: string) => parseInt(hotelId, 10))

	        const loadedHotels = await AppDataSource.manager.findBy(Hotel, {
		    id: In(hotelsIds),
      	   })
			 program.hotels = loadedHotels
            

			 const oldCoverPicture = program.cover_picture
			 if (oldCoverPicture && oldCoverPicture !== '') {
				 await unlinkSync(`${UPLOAD_DIRECTORY}${oldCoverPicture}`)
			 }
			 const path = `${req.file.destination}${req.file.filename}`.replace(
				 UPLOAD_DIRECTORY,
				 ''
			 )
			 program.cover_picture = path
			 await program.save()

			res.json({
				success: true,
				data: program,
			})
		}
	} catch (error: any) {
		res.json(formatValidationErrors(error))

	}
}
