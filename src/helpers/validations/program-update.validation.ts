import Joi from 'joi'

export const programUpdateValidation = Joi.object().keys({
	name: Joi.string().alphanum().min(3).required(),
	description: Joi.string().alphanum().min(5).required(),
	price: Joi.string().required(),
	hotels: Joi.array().required(),
	
})
