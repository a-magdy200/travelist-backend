import Joi from 'joi'

export const userValidation = Joi.object({
	name: Joi.string().alphanum().min(3).required(),
	email: Joi.string().min(3).required(),
	password: Joi.string().alphanum().min(3).required(),
	address: Joi.string().min(3).required(),
	type: Joi.string().min(3),
})
