const Joi = require('joi').extend(require('@joi/date'))

export const cycleValidation = Joi.object().keys({
	name: Joi.string().min(3).required(),
	max_seats: Joi.number().min(5).required(),

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

	departure_location: Joi.string().min(5).required(),
	arrival_location: Joi.string().min(5).required(),
	return_location: Joi.string().min(5).required(),
	return_arrival_location: Joi.string().min(5).required(),
	programId: Joi.number().min(1).required(),
})
