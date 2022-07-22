const Joi = require('joi').extend(require('@joi/date'))

export const postStatusValidation = Joi.object().keys({
	status: Joi.string().default('reported')


})
