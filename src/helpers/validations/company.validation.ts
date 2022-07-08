const Joi = require('joi').extend(require('@joi/date'))

export const companyValidation = Joi.object().keys({
	description: Joi.string().min(5).required(),
})
