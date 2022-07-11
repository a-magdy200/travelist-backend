import Joi from 'joi'

export const programValidation = Joi.object().keys({
	name: Joi.string().alphanum().min(3).required(),
	description: Joi.string().alphanum().min(5).required(),
	price: Joi.string().required(),
	companyId: Joi.string().required(),
	countryId: Joi.string().required(),
	transportationId: Joi.number().required(),
	hotels: Joi.required(),
	destinations:Joi.required(),
	is_Recurring: Joi.string().valid('0', '1').required(),
})
