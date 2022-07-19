import Joi from 'joi'

export const userEditValidation = Joi.object().keys({
	name: Joi.string().alphanum().min(3).required(),
	email: Joi.string().email().required(),
	address: Joi.string().alphanum().min(3).required(),

})
