const Joi = require('joi')

export const companyValidation = Joi.object().keys({
	description: Joi.string().min(5).required(),
})
