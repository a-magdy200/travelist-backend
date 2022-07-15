import Joi from 'joi'

export const transportationValidation = Joi.object().keys({
	name: Joi.string().alphanum().min(3).required(),
})
