import Joi from 'joi'

export const hotelValidation = Joi.object().keys({
	name: Joi.string().min(3).required(),
	address: Joi.string().min(3).required(),
	stars: Joi.number().min(1).max(5).required(),
	countryId: Joi.number().positive().required(),
	id: Joi.number().positive(),
})
