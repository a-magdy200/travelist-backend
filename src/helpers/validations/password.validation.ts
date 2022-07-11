import Joi from 'joi'

export const passwordValidation = Joi.object().keys({
	password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]')),
})
