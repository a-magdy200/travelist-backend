const Joi = require('joi').extend(require('@joi/date'))

export const companyValidation = Joi.object().keys({
	rate: Joi.number().min(1).max(5).required(),
	description: Joi.string().alphanum().min(5).required(),
	cover_picture: Joi.string().alphanum().min(5),
})
