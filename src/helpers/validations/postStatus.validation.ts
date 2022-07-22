const Joi = require('joi').extend(require('@joi/date'))

export const postStatusValidation = Joi.object().keys({
	// content: Joi.string().min(3).required(),
	status: Joi.string().valid('reported'),
	groupId: Joi.number().min(1),
})
