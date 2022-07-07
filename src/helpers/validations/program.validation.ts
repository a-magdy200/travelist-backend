import Joi from 'joi'

export const programValidation = Joi.object().keys({
	name: Joi.string().alphanum().min(3).required(),
	description: Joi.string().alphanum().min(5).required(),
	price: Joi.string().required(),
	companyId: Joi.number().required(),
	hotels: Joi.required(),
	is_Recurring:Joi.boolean().required(),
	
})
