import Joi from 'joi'

export const verifyCodeValidation = Joi.object().keys({
	email: Joi.string().email().required(),
	code: Joi.string().length(10).required(),
})
