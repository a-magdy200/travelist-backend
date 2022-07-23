import { StatusCodes } from '../../helpers/constants/statusCodes'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { Request, Response } from 'express'
import { bookingValidation } from '../../helpers/validations/book-cycle.validation'
import { IBookInterface } from '../../helpers/interfaces/IBook.interface'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { AppDataSource } from '../../config/database/data-source'
import { Cycle } from '../../entities/Cycle.entity'
import { Traveler } from '../../entities/Traveler.entity'
import { CycleBooking } from '../../entities/CycleBooking'
import { User } from '../../entities/User.entity'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import Stripe from 'stripe'
import { v4 as uuid } from 'uuid'
import { Transaction } from '../../entities/Transaction.entity'
import { NotificationEnum } from '../../helpers/enums/notification.enum'
import notify from '../../helpers/common/notify'
import { emailHandler } from '../../helpers/common/email-handler'
import { paymentDetailsEmail } from '../../helpers/emails/payment_details.email'
import { PAYMENT_PROCESS_SUBJECT } from '../../helpers/constants/emailParams'

export const bookCycle = async (req: Request, res: Response) => {
	try {
		const bodyObject: IBookInterface = await bookingValidation.validateAsync(
			req.body,
			{
				abortEarly: false,
			}
		)
		const cycle = await AppDataSource.getRepository(Cycle).findOneOrFail({
			where: {
				id: bodyObject.cycleId,
			},
			relations: ['program', 'program.company'],
		})
		const userId: number = getUserIdFromToken(req)
		if (userId) {
			const traveler = await AppDataSource.getRepository(
				Traveler
			).findOneOrFail({
				where: {
					user: { id: userId },
				},
				relations: ['user'],
			})
			const user = await AppDataSource.getRepository(User).findOneOrFail({
				where: {
					id: userId,
				},
			})
			const previousCycle = await AppDataSource.getRepository(
				CycleBooking
			).findOne({
				where: {
					travelers: { id: traveler.id },
					cycle: { id: cycle.id },
				},
			})

			if (
				traveler &&
				user &&
				cycle &&
				!previousCycle &&
				cycle.current_seats + bodyObject.bookingSeats < cycle.max_seats
			) {
				const booking = await AppDataSource.manager.create<CycleBooking>(
					CycleBooking,
					bodyObject
				)
				cycle.current_seats += bodyObject.bookingSeats
				booking.travelers = traveler
				booking.cycle = cycle
				await AppDataSource.manager.save(booking)
				await AppDataSource.manager.save(cycle)
				console.log('booooooooking')

				/*************** Transaction*******************/
				const { token } = req.body
				const stripe = new Stripe(
					'sk_test_51LNL5KAolBbZGsicDBdmJs9IFIpCI146iDMcUJPH1rMIVzCP6BoHaES0WMlgMBHRixb3oRpJKMPWXEsLUgoylerj00RgpfiYSe',
					{
						apiVersion: '2020-08-27',
					}
				)

				return stripe.customers
					.create({
						email: token.email,
						source: token.id,
					})
					.then(async (customer) => {
						stripe.charges.create({
							amount: cycle.program?.price,
							currency: 'usd',
							customer: customer.id,
							receipt_email: token.email,
							description: `cycle name :${cycle.name}`,
							shipping: {
								name: token.card.name,
								address: {
									country: 'egypt',
								},
							},
						})
						const transaction = await AppDataSource.manager.create<Transaction>(
							Transaction,
							{
								payment_id: token.id,
								amount: cycle.program?.price,
							}
						)
						transaction.user = user
						transaction.booking = booking
						booking.is_paid = true
						console.log('transactiiiiion')
						await AppDataSource.manager.save(transaction)
						await AppDataSource.manager.save(booking)

            // before response
						if (cycle.program?.company.userId) {
							notify({
								type: NotificationEnum.CYCLE_BOOKED,
								userId: cycle.program?.company.userId,
								content: `New Traveler has booked your cycle`,
								title: 'Cycle booked',
							})
						}

						// before response
						const email = user.email
						await emailHandler({
							email,
							subject: PAYMENT_PROCESS_SUBJECT,
							html: paymentDetailsEmail(),
						})
            
					})
					.then((data) => {
						res.status(200).json({ success: true, data: 'booked successfully' })
					})
					.catch((error) =>
						sendErrorResponse(
							formatValidationErrors(error),
							res,
							StatusCodes.NOT_ACCEPTABLE
						)
					)
			} else {
				sendErrorResponse(
					['Booking is Not Allowed'],
					res,
					StatusCodes.NOT_ACCEPTABLE
				)
			}
		} else {
			sendErrorResponse(
				['You should have Account to book'],
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
	/* try {
    const bodyObject: IBookInterface = await bookingValidation.validateAsync(req.body, {
      abortEarly: false,
    })
    const cycle = await AppDataSource.getRepository(Cycle).findOneOrFail({
      where: {
        id: bodyObject.cycleId
      },
      relations: ["program"],
    })
    const userId: number = getUserIdFromToken(req)
    if(userId){
    const traveler = await AppDataSource.getRepository(Traveler).findOne({
      where: {
        user:{id: userId}
      },
      relations: ["user"],
    })
console.log("traveler",traveler)
    const user = await AppDataSource.getRepository(User).findOneOrFail({
      where: {
        id: userId
      },
    })
    const previousCycle = await AppDataSource.getRepository(CycleBooking).findOne({
      where: {
        travelers: { id: traveler?.id },
        cycle: { id: cycle?.id }
      },
    })
    if (traveler && user && cycle && !previousCycle && cycle.current_seats < cycle.max_seats) {
      const booking = await AppDataSource.manager.create<CycleBooking>(CycleBooking, bodyObject)
      cycle.current_seats++
      booking.travelers = traveler
      booking.cycle = cycle
      await AppDataSource.manager.save(booking)
      await AppDataSource.manager.save(cycle)
      const { token } = req.body
      // const idempontencyKey=uuid()
      const stripe = new Stripe('sk_test_51LNL5KAolBbZGsicDBdmJs9IFIpCI146iDMcUJPH1rMIVzCP6BoHaES0WMlgMBHRixb3oRpJKMPWXEsLUgoylerj00RgpfiYSe', {
        apiVersion: '2020-08-27',
      });
      return stripe.customers.create({
        email: token.email,
        source: token.id
      }).then(async (customer) => {
        stripe.charges.create({
          amount: cycle.program?.price,
          currency: 'usd',
          customer: customer.id,
          receipt_email: token.email,
          description: `cycle name :${cycle.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: "egypt"
            }
          }
        })
        const transaction = await AppDataSource.manager.create<Transaction>(Transaction, {
          payment_id: token.id,
          amount: cycle.program?.price,
        })
        transaction.user = user
        transaction.booking = booking
        booking.is_paid = true
        await AppDataSource.manager.save(transaction)
        await AppDataSource.manager.save(booking)
      })
        .then(data => {
          console.log(data)
          res.status(200).json({success:true,data:"booked successfully"})
        })
        .catch(e => console.log(e))
    }
    else {
      sendErrorResponse(
       ["Booking is Not Allowed"],
        res,
        StatusCodes.NOT_ACCEPTABLE
      )
    }
  }
  else
  {
    sendErrorResponse(
      ["You should have Account to book"],
       res,
       StatusCodes.NOT_ACCEPTABLE
     )
  }
}
  catch (error: any) {
    sendErrorResponse(
      formatValidationErrors(error),
      res,
      StatusCodes.NOT_ACCEPTABLE
    )
  }
*/
}
