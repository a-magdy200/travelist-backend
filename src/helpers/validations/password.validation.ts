import Joi from 'joi'

export const passwordValidation = Joi.object().keys({
	password: Joi.string().min(6).required(),
})
