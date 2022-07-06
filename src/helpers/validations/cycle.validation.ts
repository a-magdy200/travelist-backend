const Joi = require('joi').extend(require('@joi/date'))

export const cycleValidation = Joi.object().keys({
	name: Joi.string().alphanum().min(3).required(),
	max_seats: Joi.number().required(),

	departure_date: Joi.date().format('YYYY-MM-DD').required(),
	arrival_date: Joi.date()
		.format('YYYY-MM-DD')
		.required()
		.ruleset.greater(Joi.ref('departure_date'))
		.rule({ message: 'arrival_date must be greater than departure_date' }),

	return_date: Joi.date()
		.format('YYYY-MM-DD')
		.required()
		.ruleset.greater(Joi.ref('arrival_date'))
		.rule({ message: 'arrival_date must be greater than departure_date' }),

	return_arrival_date: Joi.date()
		.format('YYYY-MM-DD')
		.required()
		.ruleset.greater(Joi.ref('departure_date'))
		.rule({ message: 'return_arrival_date must be greater than return_date' }),

	departureLocationId: Joi.number().required(),
	arrivalLocationId: Joi.number().required(),
	returnArrivalLocationId: Joi.string()
		.min(1)
		.pattern(/^[0-9]+$/)
		.required(),
	returnLocationId: Joi.string()
		.min(1)
		.pattern(/^[0-9]+$/)
		.required(),
	programId: Joi.number().required(),
})
