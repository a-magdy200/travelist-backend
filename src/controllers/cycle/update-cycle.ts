import { Cycle } from '../../entities/Cycle.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { cycleValidation } from '../../helpers/validations/cycle.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { ICycleInterface } from '../../helpers/interfaces/ICycle.interface'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import notify from '../../helpers/common/notify'
import { NotificationEnum } from '../../helpers/enums/notification.enum'

export const updateCycle = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = parseInt(req.params.id)
		const bodyObject: ICycleInterface = await cycleValidation.validateAsync(
			req.body,
			{
				abortEarly: false,
			}
		)
		const cycle: Cycle | null = await AppDataSource.getRepository(
			Cycle
		).findOne({
			where: {
				id: parseInt(req.params.id),
			},
			relations: ['bookings.travelers'],
		})
		if (cycle) {
			cycle.name = bodyObject.name
			cycle.max_seats = bodyObject.max_seats
			cycle.departure_date = bodyObject.departure_date
			cycle.arrival_date = bodyObject.arrival_date
			cycle.return_date = bodyObject.return_date
			cycle.return_arrival_date = bodyObject.return_arrival_date
			cycle.departure_location = bodyObject.departure_location
			cycle.arrival_location = bodyObject.arrival_location
			cycle.return_location = bodyObject.return_location
			cycle.return_arrival_location = bodyObject.return_arrival_location
			await cycle.save()

			sendSuccessResponse<Cycle>(res, cycle)

			cycle.bookings.forEach((booking) => {
				const id = booking.travelers.userId
				notify({
					type: NotificationEnum.CYCLE_BOOKED_UPDATED,
					userId: id,
					content: `New update has been added to a cycle you have booked`,
					title: 'Booked Cycle Updated',
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
