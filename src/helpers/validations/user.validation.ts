import Joi from 'joi'

export const userValidation = Joi.object().keys({
	name: Joi.string().min(3).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	address: Joi.string().min(3).required(),
	type: Joi.string().valid('traveler', 'company').required(),
})

export const userProfileValidation = Joi.object().keys({
	name: Joi.string().min(3).required(),
	address: Joi.string().min(3).required(),
})
