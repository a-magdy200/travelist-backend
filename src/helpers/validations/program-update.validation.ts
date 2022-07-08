import Joi from 'joi'

export const programUpdateValidation = Joi.object().keys({
	name: Joi.string().min(3).required(),
	description: Joi.string().min(5).required(),
	price: Joi.string().required(),
	hotels: Joi.array().required(),
	
})
