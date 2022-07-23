import { Program } from '../../entities/Program.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { UPLOAD_DIRECTORY } from '../../helpers/constants/directories'
import { programUpdateValidation } from '../../helpers/validations/program-update.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { Hotel } from '../../entities/Hotel.entity'
import { In } from 'typeorm'
import { unlinkSync } from 'fs'
import { IProgramInterface } from '../../helpers/interfaces/IProgram.interface'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { Company } from '../../entities/Company.entity'


export const update = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		const validation: Program = await programUpdateValidation.validateAsync(
			req.body,
			{
				abortEarly: false,
			}
		)
		const bodyObject: IProgramInterface = { ...req.body }
		const program: Program | null = await AppDataSource.getRepository(
			Program
		).findOneByOrFail({
				id,
		})

		if (program && validation) {
			program.name = validation.name
			program.description = validation.description
			program.price = validation.price
			const hotelsIds =
				typeof bodyObject.hotels === 'string'
					? [parseInt(bodyObject.hotels, 10)]
					: bodyObject.hotels?.map((hotelId: string) => parseInt(hotelId, 10))

			if (hotelsIds) {
				program.hotels = await AppDataSource.manager.findBy(Hotel, {
					id: In(hotelsIds),
				})
			}
			if (req.file?.filename) {
				const oldCoverPicture = program.cover_picture
				if (oldCoverPicture && oldCoverPicture !== '') {
					await unlinkSync(`${UPLOAD_DIRECTORY}${oldCoverPicture}`)
				}
				program.cover_picture =
					`${req.file.destination}${req.file.filename}`.replace(
						UPLOAD_DIRECTORY,
						''
					)
			}
			await program.save()

			sendSuccessResponse<Program>(res, program)
		}
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
