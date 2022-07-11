import Joi from 'joi'

export const loginValidation = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]')).required(),
})
