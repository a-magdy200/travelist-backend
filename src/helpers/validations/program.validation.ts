import Joi from 'joi'

export const programValidation = Joi.object().keys({
	name: Joi.string().min(3).required(),
	description: Joi.string().min(5).required(),
	price: Joi.string().required(),
	countryId: Joi.string().required(),
	transportationId: Joi.number().required(),
	hotels: Joi.required(),
	destinations:Joi.required(),
	is_Recurring: Joi.string().valid('0', '1').required(),
})
