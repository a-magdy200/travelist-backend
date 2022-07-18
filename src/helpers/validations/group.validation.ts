import Joi from 'joi'

export const groupValidation = Joi.object().keys({
	countryId: Joi.number().min(1).required(),
})
