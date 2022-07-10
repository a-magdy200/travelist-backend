import Joi from 'joi'

export const programValidation = Joi.object().keys({
	name: Joi.string().min(3).required(),
	description: Joi.string().min(5).required(),
	price: Joi.string().required(),
	companyId: Joi.string().required(),
	transportationId: Joi.number().required(),
	hotels: Joi.array().required(),
	is_Recurring: Joi.string().valid('0', '1').required(),
})
